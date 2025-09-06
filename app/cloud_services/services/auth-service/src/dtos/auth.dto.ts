import { IsString, MinLength, IsOptional, IsEmail } from "class-validator";

export class LoginDto {
  @IsString() username!: string;
  @IsString() @MinLength(6) password!: string;
}

export class RegisterDto {
  @IsString() username!: string;
  @IsOptional() @IsEmail() email?: string;
  @IsString() @MinLength(6) password!: string;
}
