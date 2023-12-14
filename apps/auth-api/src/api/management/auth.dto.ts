import { Management } from "@app/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Trim } from "class-sanitizer";
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @ApiProperty({ default: "test@gmail.com" })
  @Trim()
  @IsEmail()
  public readonly email: string;

  @ApiProperty({ default: "Password123!" })
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  public readonly password: string;
}

export class LoginDto {
  @ApiProperty({ default: "test@gmail.com" })
  @Trim()
  @IsEmail()
  public readonly email: string;

  @ApiProperty({ default: "Password123!" })
  @IsString()
  public readonly password: string;
}

export class DataDTO {
  @ApiProperty()
  public readonly user: Management;

  @ApiProperty()
  @IsString()
  public readonly token: string;
}

export class LoginResponseDTO {
  @ApiProperty()
  public readonly data: DataDTO;

  @ApiProperty()
  @IsString()
  public readonly success: boolean;
}

export class CreateBranchDto {
  @ApiProperty({ default: "test@gmail.com" })
  @Trim()
  @IsEmail()
  public readonly email: string;

  @ApiProperty({
    default: "0557d6ef-bc10-4a9a-967f-0520c3abeb55",
    description: "You can get operating area id, from get opreating area",
  })
  @IsString()
  public readonly operatingAreaId: string;
}

export class CreateOperatingAreaDto {
  @ApiProperty({ default: "Jakarta Selatan" })
  @Trim()
  @IsString()
  public readonly name: string;
}
