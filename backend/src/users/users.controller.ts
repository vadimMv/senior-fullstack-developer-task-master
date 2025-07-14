import {
  Controller,
  NotFoundException,
  UnauthorizedException,
  Param,
  Post,
  Put,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { UserStatus } from './user-status.enum';
import { UpdateUserRolesDto, UpdateUserStatusDto } from './dto/update-user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard, Roles } from '../guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('/login/:username')
  async login(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException(`The user - ${username} - not found`);
    }

  
    if (user.isDeleted()) {
      throw new UnauthorizedException('Access denied: User account has been deleted');
    }

   
    if (user.isDisabled()) {
      throw new UnauthorizedException('Access denied: User account is disabled');
    }

    return user;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  @Put('/:id/roles')
  async updateUserRoles(
    @Param('id') id: number,
    @Body() updateRolesDto: UpdateUserRolesDto
  ): Promise<User> {
    const user = await this.usersService.updateUserRoles(id, updateRolesDto.roles);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  @Put('/:id/status')
  async updateUserStatus(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdateUserStatusDto
  ): Promise<User> {
    const user = await this.usersService.updateUserStatus(id, updateStatusDto.status);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin', 'Moderator')
  @Post('/:id/roles/:role')
  @HttpCode(HttpStatus.OK)
  async addRole(
    @Param('id') id: number,
    @Param('role') role: string
  ): Promise<User> {
    const user = await this.usersService.addRoleToUser(id, role);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin', 'Moderator')
  @Put('/:id/roles/:role/remove')
  async removeRole(
    @Param('id') id: number,
    @Param('role') role: string
  ): Promise<User> {
    const user = await this.usersService.removeRoleFromUser(id, role);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin', 'Moderator')
  @Get('/role/:role')
  async getUsersByRole(@Param('role') role: string): Promise<User[] | null> {
    return this.usersService.findUsersByRole(role);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  @Get('/status/:status')
  async getUsersByStatus(@Param('status') status: UserStatus): Promise<User[]> {
    return this.usersService.findUsersByStatus(status);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  @Put('/:id/disable')
  async disableUser(@Param('id') id: number): Promise<User> {
    const user = await this.usersService.disableUser(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  @Put('/:id/enable')
  async enableUser(@Param('id') id: number): Promise<User> {
    const user = await this.usersService.enableUser(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  @Put('/:id/delete')
  async softDeleteUser(@Param('id') id: number): Promise<User> {
    const user = await this.usersService.softDeleteUser(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
}