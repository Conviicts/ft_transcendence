/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Res,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { parse } from 'cookie';

import { User } from '../entities/user.entity';
import {
  NewUserDTO,
  UpdateUserDTO,
  LoginUserDTO,
  User42DTO,
} from '../dto/user.dto';
import { UserRepository } from '../repositories/user.repository';
import { JwtPayload } from '../strategy/jwt.strategy';
import { UserState } from '../interfaces/user-state.interface';
import { AvatarService } from '../services/avatar.service';
import { Socket } from 'socket.io';
import { Avatar } from '../entities/avatar.entity';
import { NotifyService } from '../../notify/notify.service';

@Injectable()
export class UserService {
  constructor(
    private readonly avatarService: AvatarService,
    private readonly notifyService: NotifyService,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async register(
    userData: NewUserDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { username, password } = userData;
    const user: Promise<User> = this.userRepository.createUser(userData);
    if (await bcrypt.compare(password, (await user).password)) {
      const auth = false;
      const payload: JwtPayload = { username, auth };
      const accessToken: string = await this.jwtService.sign(payload);
      res.cookie('jwt', accessToken, { httpOnly: true });
      return { accessToken };
    } else {
      throw new InternalServerErrorException('access token creation error');
    }
  }

  async login(
    userData: LoginUserDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { id, password } = userData;
    let user: User = undefined;

    user = await this.userRepository.findOne({ where: { username: id } });
    if (user === undefined) {
      user = await this.userRepository.findOne({ where: { email: id } });
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      const username = user.username;
      const auth = false;
      const payload: JwtPayload = { username, auth };
      const accessToken: string = await this.jwtService.sign(payload);
      res.cookie('jwt', accessToken, { httpOnly: true });
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async currentUser(uid: string): Promise<Partial<User>> {
    let userFound: User = undefined;
    userFound = await this.userRepository.findOne({
      where: { uid },
    });
    if (!userFound) throw new NotFoundException('No user found');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = userFound;
    return result;
  }

  async updateUser(
    updateUser: UpdateUserDTO,
    user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { username } = updateUser;

    const updated: boolean = await this.userRepository.updateUser(
      updateUser,
      user,
    );
    if (updated === true && username !== undefined) {
      const auth = true;
      const payload: JwtPayload = { username, auth };
      const accessToken: string = await this.jwtService.sign(payload);
      res.cookie('jwt', accessToken, { httpOnly: true });
    }
  }

  async getAvatar(uid: string): Promise<Avatar> {
    const user: User = await this.getUser(uid);
    if (!user.avatar)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user.avatar;
  }

  async setAvatar(uid: string, file: Express.Multer.File): Promise<void> {
    if (!file)
      throw new HttpException('File required', HttpStatus.NOT_ACCEPTABLE);

    const filename = file.originalname;
    const data = file.buffer;

    const user: User = await this.getUser(uid);

    await this.avatarService.createAvatar(filename, data, user);
    if (user.avatar) await this.avatarService.deleteAvatar(user.avatar.id);
  }

  get2FA(user: User): boolean {
    return user.have2FA;
  }

  async updateStatus(status: UserState, uid: string): Promise<void> {
    let res: User = undefined;

    res = await this.userRepository.findOne({ where: { uid } });
    if (!res) throw new NotFoundException('No user found');

    res.status = status;
    try {
      await this.userRepository.save(res);
      this.notifyService.emitStatus(uid, status);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async update2FA(twoFA: boolean, user: User, res: Response): Promise<void> {
    user.have2FA = twoFA;
    const username = user.username;
    try {
      await this.userRepository.save(user);
      const auth = true;
      const payload: JwtPayload = { username, auth };
      const accessToken: string = await this.jwtService.sign(payload);
      res.cookie('jwt', accessToken, { httpOnly: true });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getIsAdmin(uid: string): Promise<boolean> {
    let user: User = undefined;

    user = await this.userRepository.findOne({ where: { uid: uid } });
    if (!user) throw new NotFoundException('No user found');
    return user.isAdmin;
  }

  async getUser(uid: string): Promise<User> {
    let user = null;
    if (uid) user = await this.userRepository.findOne({ where: { uid } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const { password, ...result } = user;
    return result;
  }

  async getUserById(id: string): Promise<Partial<User>> {
    let user = null;
    if (id) user = await this.userRepository.findOne({ where: { uid: id } });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user;
  }

  async getUserInfos(id: string): Promise<Partial<User>> {
    let user: User = undefined;

    user = await this.userRepository.findOne({ where: { uid: id } });
    if (!user) return user;
    return {
      uid: user.uid,
      username: user.username,
      avatar: user.avatar,
    };
  }

  async getUserBySocket(client: Socket): Promise<User> {
    const cookie = client.handshake.headers['cookie'];
    const { jwt } = parse(cookie);
    const payload: JwtPayload = this.jwtService.verify(jwt, {
      secret: process.env.SECRET,
    });
    const { username } = payload;
    const user: User = await this.userRepository.findOne({
      where: { username },
    });
    return user;
  }

  async updateIsAdmin(
    bool: boolean,
    uid: string,
    userIsAdmin: User,
  ): Promise<void> {
    let user: User = undefined;

    if (userIsAdmin.uid === uid) {
      throw new UnauthorizedException('Cannot change your own admin state');
    }

    user = await this.userRepository.findOne({ where: { uid: uid } });
    if (!user) throw new NotFoundException('No user found');

    user.isAdmin = bool;
    try {
      await this.userRepository.save(user);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  create42User(userData: User42DTO): Promise<User> {
    return this.userRepository.create42User(userData);
  }

  async validate42User(userData: User42DTO): Promise<User> {
    let user: User = undefined;

    const { login42 } = userData;
    user = await this.userRepository.findOne({ where: { login42 } });
    if (user) return user;
    let { username } = userData;
    user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      const rand = Math.random().toString(16).substr(2, 5);
      username = username + '-' + rand;
      userData.username = username;
    }
    const newUser: User = await this.create42User(userData);
    return newUser;
  }
}
