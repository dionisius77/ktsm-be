import { ApiProperty } from "@nestjs/swagger";
import { ContentType } from "apps/message-api/src/api/management/message.dto";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Message extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @ApiProperty()
  @Column({ type: "text", nullable: true })
  public title!: string;

  @ApiProperty()
  @Column({
    type: "enum",
    enum: ContentType,
    nullable: false,
    default: ContentType.Text,
  })
  public contentType!: ContentType;

  @ApiProperty()
  @Column({ type: "text", nullable: false, default: "" })
  public content!: string;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: false, default: new Date() })
  public createdAt: Date;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: true })
  public updatedAt: Date;
}

export { Message };
