import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';

import { UserRole } from '../../users/entities/user-role.entity';
import { Channel } from '../entities/channel.entity';
import { IUserRole } from '../../users/interfaces/user.interface';

@Injectable()
export class UserRoleService {
    constructor (
        @InjectRepository(UserRole)
        private readonly userRoleRepository: Repository<UserRole>
    ) {}

    async create(data:any): Promise<IUserRole> {
        let { user, channel, ban, mute } = data;

        if (ban > 0) {
            let dateBan = new Date;
            dateBan.setDate(dateBan.getDate() + ban);
            ban = dateBan;
        } else {
            ban = null;
        }
        if (mute > 0) {
            let dateMute = new Date;
            dateMute.setDate(dateMute.getDate() + mute)
            mute = dateMute;
        } else {
            mute = null;
        }
        const newRole: IUserRole = await this.userRoleRepository.save({userId: user.userId, ban, mute, channel});
        return newRole;
    }

    async updateRole(role: IUserRole, data: any): Promise<IUserRole> {
        let { ban, mute, unBan, unMute } = data;
        
        if (ban > 0) {
            let dateBan = new Date;
            dateBan.setDate(dateBan.getDate() + ban);
            role.ban = dateBan;
        }
        if(unBan) {
            role.ban = null;
        }
        if (mute > 0) {
            let dateMute = new Date;
            dateMute.setDate(dateMute.getDate() + mute)
            role.mute = dateMute;
        }
        if (unMute) {
            role.mute = null;
        }
       const newRole: IUserRole =  await this.userRoleRepository.save(role);
       return newRole;
    }

    // async findUserByChannel(channel: Channel, userId: string): Promise<IUserRole> {
    //     return this.userRoleRepository.findOne({ where: { channel: channel as FindOptionsWhere<Channel>, userId: userId } }); //TODO: fix fking thing
    // }
}