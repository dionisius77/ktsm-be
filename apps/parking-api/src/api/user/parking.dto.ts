import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CheckInGateDto {
  @ApiProperty({ default: "DD:77:99:10:12:22" })
  @IsString()
  public readonly macAdress: string;

  @ApiProperty({ default: "6e51ca26-b880-493a-b921-89c639de8a2d" })
  @IsString()
  public readonly vehicleId: string;
}

export class CheckOutGateDto {
  @ApiProperty({ default: "" })
  @IsString()
  public readonly sessionId: string;

  @ApiProperty({ default: "DD:77:99:10:12:21" })
  @IsString()
  public readonly macAdress: string;

  @ApiProperty({ default: "6e51ca26-b880-493a-b921-89c639de8a2d" })
  @IsString()
  public readonly vehicleId: string;
}

export class CreateVehicleDto {
  @ApiProperty({ default: "My Car" })
  @IsString()
  public readonly name: string;

  @ApiProperty({ default: "Toyota Alphard" })
  @IsString()
  public readonly brand: string;

  @ApiProperty({ default: "L 1544 ABT" })
  @IsString()
  public readonly licensePlate: string;
}
