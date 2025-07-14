import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UserStatus } from './user-status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  findActiveByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({
      username,
      status: UserStatus.ENABLED
    });
  }

  async updateUserRoles(userId: number, roles: string[]): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (user) {
      user.setRoles(roles);
      return this.usersRepository.save(user);
    }
    return null;
  }

  async updateUserStatus(userId: number, status: UserStatus): Promise<User | null> {
    await this.usersRepository.update(userId, { status });
    return this.usersRepository.findOneBy({ id: userId });
  }

  async addRoleToUser(userId: number, role: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (user) {
      user.addRole(role);
      return this.usersRepository.save(user);
    }
    return null;
  }

  async removeRoleFromUser(userId: number, role: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (user) {
      user.removeRole(role);
      return this.usersRepository.save(user);
    }
    return null;
  }

  async findUsersByRole(role: string): Promise<User[] | null> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('user.roles LIKE :role', { role: `%"${role}"%` })
      .getMany();
  }

  async findUsersByStatus(status: UserStatus): Promise<User[]> {
    return await this.usersRepository.findBy({ status });
  }

  async softDeleteUser(userId: number): Promise<User> {
    const user = await this.updateUserStatus(userId, UserStatus.DELETED);
    return user!;
  }
  async enableUser(userId: number): Promise<User> {
    const user = await this.updateUserStatus(userId, UserStatus.ENABLED);
    return user!;
  }

  async disableUser(userId: number): Promise<User> {
    const user = await this.updateUserStatus(userId, UserStatus.DISABLED);
    return user!;
  }
}