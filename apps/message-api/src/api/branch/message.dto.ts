import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  ValidateNested,
} from "class-validator";

export class ReadMessageDto {
  @ApiProperty()
  @IsArray()
  public readonly ids: string[];
}
