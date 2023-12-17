import { ApiProperty } from "@nestjs/swagger";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Message } from "./message.entity";
import { Branch } from "./branch.entity";
import { ContentType } from "apps/message-api/src/api/management/message.dto";

@Entity()
class MessageLogs extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @ApiProperty()
  @Column({
    type: "enum",
    enum: ContentType,
    nullable: true,
  })
  public contentType?: ContentType;

  @ApiProperty()
  @Column({ type: "text", nullable: true })
  public content?: string;

  @ApiProperty({ type: () => Message })
  @ManyToOne(() => Message, { nullable: false })
  @JoinColumn({ name: "messageId", referencedColumnName: "id" })
  message: Message;
  @Column({ type: "string" })
  public messageId: string;

  @ApiProperty({ type: () => Branch })
  @ManyToOne(() => Branch, { nullable: false })
  @JoinColumn({ name: "branchId", referencedColumnName: "id" })
  branch: Branch;
  @Column({ type: "string" })
  public branchId: string;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: false })
  public broadcastedAt: Date;

  @ApiProperty()
  @Column({ type: "boolean", default: false })
  public isBroadcasted: boolean;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: false })
  public expiredAt: Date;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: true })
  public deliveredAt: Date;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: false, default: new Date() })
  public createdAt: Date;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: true })
  public updatedAt: Date;
}

export { MessageLogs };
