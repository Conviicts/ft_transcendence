import { Injectable, UnauthorizedException, NotFoundException, UploadedFile, Res, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { User } from './entities/user.entity';
import { NewUserDTO, UpdateUserDTO, LoginUserDTO, User42DTO } from "./dto/user.dto";
import { UserRepository } from './user.repository';
import { JwtPayload } from './strategy/jwt.strategy';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
		private jwtService: JwtService,
	) { }

	async register(userData: NewUserDTO, @Res({passthrough: true}) res: Response): Promise<{accessToken: string}> {
		const {username, password } = userData;
		const user: Promise<User> = this.userRepository.createUser(userData);
		if (await bcrypt.compare(password, (await user).password)) {
			let auth: boolean = false;
			const payload: JwtPayload = { username, auth };
			const accessToken: string = await this.jwtService.sign(payload);
			res.cookie('token', accessToken, {httpOnly: true});
			return {accessToken};
        } else {
            throw new InternalServerErrorException('access token creation error')
        }
	}


	async login(userData: LoginUserDTO, @Res({passthrough: true}) res: Response): Promise<{accessToken: string}> {
		const { id, password } = userData;
		let user: User = undefined;

		user = await this.userRepository.findOne({ where: { username: id } });
		if (user === undefined) {
			user = await this.userRepository.findOne({ where: { email: id } });
		}
		if (user && (await bcrypt.compare(password, user.password))) {
			const username = user.username;
			let auth: boolean = false;
			const payload: JwtPayload = { username, auth };
			const accessToken: string = await this.jwtService.sign(payload);
			res.cookie('jwt', accessToken, {httpOnly: true});
			return {accessToken};
        } else {
            throw new UnauthorizedException('Please check your login credentials');
        }
	}

	async currentUser(user: User): Promise<Partial<User>>{
		let userFound: User = undefined;
		userFound = await this.userRepository.findOne({ where: { userId: user.userId } });
		if (!user)
			throw new NotFoundException('No user found');
		let { password, ...res } = user;
		return res;
	}


	async updateUser(updateUser: UpdateUserDTO, user: User, @Res({passthrough: true}) res: Response): Promise<void> {
		const { username } = updateUser;

		const updated: boolean = await this.userRepository.updateUser(updateUser, user);
		if (updated === true && username !== undefined)
		{
		   	let auth: boolean = true;
			const payload: JwtPayload = { username, auth };
			const accessToken: string = await this.jwtService.sign(payload);
			res.cookie('jwt', accessToken, {httpOnly: true});
		}
	}

	async deleteUser(id: string, @Res({passthrough: true}) res: Response): Promise<void> {
		res.clearCookie('jwt');
		const result = await this.userRepository.delete(id);
	}

	get2FA(user: User): boolean {
		return user.twoFactor;
	}

	async update2FA(twoFA: boolean, user: User, res: Response): Promise<void> {
		user.twoFactor = twoFA;
		const username = user.username;
		try {
			await this.userRepository.save(user);
			let auth: boolean = true;
			const payload: JwtPayload = { username, auth };
			const accessToken: string = await this.jwtService.sign(payload);
			res.cookie('token', accessToken, {httpOnly: true});
		} catch (e) {
			console.log(e);
			throw new InternalServerErrorException();
		}
	}

	async getIsAdmin(userId: string, userIsAdmin: User): Promise<boolean> {
		let user: User = undefined;

		user = await this.userRepository.findOne({ where: { userId: userId } });
		if (!user)
			throw new NotFoundException('No user found');
		return user.isAdmin;
	}

	async updateIsAdmin(bool: boolean, userId: string, userIsAdmin: User): Promise<void> {
		let user: User = undefined;

		if (userIsAdmin.userId === userId) {
			throw new UnauthorizedException('Cannot change your own admin state');
		}

		user = await this.userRepository.findOne({ where: { userId: userId } });
		if (!user)
			throw new NotFoundException('No user found');

		user.isAdmin = bool;
		try {
			await this.userRepository.save(user);
		} catch (e) {
			console.log(e);
			throw new InternalServerErrorException();
		}
	}

	create42User(userData: User42DTO): Promise<User>{
		return this.userRepository.create42User(userData);
	}

	async validate42User(userData: User42DTO): Promise<User> {
		let user: User = undefined;

		const { login42 } = userData;
		user = await this.userRepository.findOne({ where: { login42 } });
		if (user)
			return user;
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