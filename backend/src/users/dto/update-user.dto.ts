import { IsArray, IsEnum, IsString, ArrayNotEmpty } from 'class-validator';
import { UserStatus } from '../user-status.enum';

export class UpdateUserRolesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  roles: string[];
}

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  status: UserStatus;
}