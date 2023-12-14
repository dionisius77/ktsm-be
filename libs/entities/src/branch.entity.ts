import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OperatingArea } from "./operating-area.entity";

@Entity()
class Branch extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @ApiProperty()
  @Column({ type: "text", nullable: false, unique: true })
  public email!: string;

  @ApiProperty({ type: () => OperatingArea })
  @ManyToOne(() => OperatingArea, { nullable: false })
  @JoinColumn({ name: "operatingAreaId", referencedColumnName: "id" })
  operatingArea: OperatingArea;
  @Column({ type: "string" })
  public operatingAreaId?: string;

  @ApiProperty()
  @Exclude()
  @Column({ type: "text", nullable: true })
  public password: string;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: false, default: new Date() })
  public createdAt!: Date;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: true })
  public updatedAt: Date;
}

export { Branch };
