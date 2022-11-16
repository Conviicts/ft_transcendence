import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from '../users/entities/user.entity';
import { AdminGuard } from '../users/guards/admin.guard';
import { UserGuard } from '../users/guards/user.guard';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ description: 'Get list of users' })
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @Get('/users')
  getAllUsers(): Promise<Partial<User[]>> {
    return this.adminService.getUsers();
  }

  @ApiOperation({ description: 'Get list of admins' })
  @UseGuards(AuthGuard('jwt'), UserGuard, AdminGuard)
  @Get('/admins')
  getAllAdmin(): Promise<Partial<User[]>> {
    return this.adminService.getAdmin();
  }
}
