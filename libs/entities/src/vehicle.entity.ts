import { ApiProperty } from "@nestjs/swagger";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
// import { User } from "./management.entity";

@Entity()
class Vehicle extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  // @ApiProperty({ type: () => User })
  // @ManyToOne(() => User, { nullable: false })
  // @JoinColumn({ name: "userId", referencedColumnName: "id" })
  // user: User;
  // @Column({ type: "string" })
  // public userId?: string;

  @ApiProperty()
  @Column({ type: "text", nullable: false, default: "" })
  public name: string;

  @ApiProperty()
  @Column({ type: "text", nullable: false, default: "" })
  public brand: string;

  @ApiProperty()
  @Column({ type: "text", nullable: false, default: "" })
  public licensePlate: string;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: false, default: new Date() })
  public createdAt: Date;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: true })
  public deletedAt: Date;
}

export { Vehicle };
