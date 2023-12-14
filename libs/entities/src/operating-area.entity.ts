import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class OperatingArea extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @ApiProperty()
  @Column({ type: "text", nullable: false, default: "" })
  public name!: string;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: false, default: new Date() })
  public createdAt: Date;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: true })
  public updatedAt: Date;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: true })
  public deletedAt: Date;
}

export { OperatingArea };
