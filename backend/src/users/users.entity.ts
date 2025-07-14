import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserStatus } from './user-status.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column('text', { default: '["User"]' }) 
  roles: string;

  getRoles(): string[] {
    try {
      return JSON.parse(this.roles);
    } catch {
      return ['User'];
    }
  }

 
  setRoles(roles: string[]): void {
    this.roles = JSON.stringify(roles);
  }

  @Column({
    type: 'text',
    default: UserStatus.ENABLED,
  })
  status: UserStatus;

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.getRoles().includes(role));
  }

  addRole(role: string): void {
    const currentRoles = this.getRoles();
    if (!currentRoles.includes(role)) {
      currentRoles.push(role);
      this.setRoles(currentRoles);
    }
  }

  removeRole(role: string): void {
    const currentRoles = this.getRoles();
    this.setRoles(currentRoles.filter(r => r !== role));
  }

  isActive(): boolean {
    return this.status === UserStatus.ENABLED;
  }

  isDeleted(): boolean {
    return this.status === UserStatus.DELETED;
  }

  isDisabled(): boolean {
    return this.status === UserStatus.DISABLED;
  }
}