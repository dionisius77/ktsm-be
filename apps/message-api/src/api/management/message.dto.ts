import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export enum ContentType {
  Text = 'Text',
  Audio = 'Audio',
  Video = 'Video',
}

export class BranchSetting {
  @ApiProperty()
  @IsString()
  public readonly id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly broadcastAt?: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly expiredAt?: Date;
}

export class CreateMessageDto {
  @ApiProperty({ default: "Meeting schedule" })
  @IsString()
  public readonly title: string;

  @ApiProperty({ enum: ContentType })
  @IsString()
  public readonly contentType: ContentType;

  @ApiProperty({ default: "<p>Empty content</p>" })
  @IsString()
  public readonly content: string;

  @ApiProperty({ type: [BranchSetting] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BranchSetting)
  @ArrayMinSize(1)
  public readonly branches: BranchSetting[];
}

export class UpdateMessageDto {
  @ApiProperty({ enum: ContentType })
  @IsString()
  public readonly contentType: ContentType;

  @ApiProperty({ default: "<p>Empty content</p>" })
  @IsString()
  public readonly content: string;
}

export class UpdateMessageLogsDto {
  @ApiProperty({ enum: ContentType })
  @IsString()
  @IsOptional()
  public readonly contentType?: ContentType | null;

  @ApiProperty({ default: "<p>Empty content</p>" })
  @IsString()
  @IsOptional()
  public readonly content?: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly broadcastAt?: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly expiredAt?: Date;
}

export class PagingDto {
  @ApiProperty({ default: 1 })
  @IsString()
  public readonly page: string;

  @ApiProperty({ default: 10 })
  @IsString()
  public readonly size: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public readonly title?: string;
}

export interface MessageFirestore {
  branchId: string;
  title: string;
  contentType: ContentType;
  content: string;
  createdAt: Date;
}
