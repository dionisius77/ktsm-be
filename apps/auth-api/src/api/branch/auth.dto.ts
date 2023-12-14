import { Branch } from "@app/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Trim } from "class-sanitizer";
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from "class-validator";


export class AdminLoginDto {
  @ApiProperty({ default: "superadmin@gmail.com" })
  @Trim()
  @IsEmail()
  public readonly email: string;

  @ApiProperty({ default: "SuperPassword123!" })
  @IsString()
  public readonly password: string;
}

export class DataDTO {
  @ApiProperty()
  public readonly user: Branch;

  @ApiProperty()
  @IsString()
  public readonly token: string;
}

export class AdminLoginResponseDTO {
  @ApiProperty()
  public readonly data: DataDTO;

  @ApiProperty()
  @IsString()
  public readonly success: boolean;
}

export class AdminResetPasswordDTO {
  @ApiProperty()
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  public readonly password: string;
}
