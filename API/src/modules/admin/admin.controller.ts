import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { User } from '../users/entities/user.entity';
import { AdminGuard } from '../users/guards/admin.guard';
import { UserGuard } from '../users/guards/user.guard';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ description: 'Get list of users/admins' })
  @ApiParam({
    name: 'admins',
    required: true,
    description: 'get admins or users',
  })
  @UseGuards(AuthGuard('jwt'), UserGuard, AdminGuard)
  @Get('/')
  getAllAdminsOrUsers(
    @Param('admins') admins: boolean,
  ): Promise<Partial<User[]>> {
    if (admins) return this.adminService.getAdmin();
    else return this.adminService.getUsers();
  }
}
