import { GateType } from "@app/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Trim } from "class-sanitizer";
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  Min,
} from "class-validator";

export class CreateParkingDto {
  @ApiProperty({ default: "Airtport A" })
  @IsString()
  public readonly name: string;

  @ApiProperty({ default: 200 })
  @IsNumber()
  @Min(10)
  public readonly capacity: number;

  @ApiProperty({ default: "Sekeloa Timur, Bandung" })
  @IsString()
  public readonly address: string;

  @ApiProperty({ default: 0.7777777 })
  @IsNumber()
  public readonly lat: number;

  @ApiProperty({ default: -0.1777777 })
  @IsNumber()
  public readonly lng: number;

  @ApiProperty({ default: false })
  @IsBoolean()
  public readonly needPayment: boolean;

  @ApiProperty({ default: "admin@airporta.com" })
  @Trim()
  @IsEmail()
  public readonly adminEmail: string;

  @ApiProperty({ default: "adminAirportA" })
  @Trim()
  @IsString()
  public readonly adminUsername: string;
}

export class UpdateParkingDto {
  @ApiProperty({ default: "Airtport A" })
  @IsString()
  public readonly name: string;

  @ApiProperty({ default: 200 })
  @IsNumber()
  @Min(10)
  public readonly capacity: number;

  @ApiProperty({ default: "Sekeloa Timur, Bandung" })
  @IsString()
  public readonly address: string;

  @ApiProperty({ default: 0.7777777 })
  @IsNumber()
  public readonly lat: number;

  @ApiProperty({ default: -0.1777777 })
  @IsNumber()
  public readonly lng: number;

  @ApiProperty({ default: false })
  @IsBoolean()
  public readonly needPayment: boolean;
}

export class CreateGateDto {
  @ApiProperty({ default: "West Gate" })
  @IsString()
  public readonly name: string;

  @ApiProperty({ default: "DD:77:99:10:12:22" })
  @IsString()
  public readonly macAddress: string;

  @ApiProperty({ default: GateType.IN })
  @IsEnum(GateType)
  public readonly type: GateType;
}
