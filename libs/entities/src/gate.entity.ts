import { ApiProperty } from "@nestjs/swagger";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
// import { Parking } from "./operating-area.entity";

export enum GateType {
  IN = "in",
  OUT = "out",
}

@Entity()
class Gate extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  // @ApiProperty({ type: () => Parking })
  // @ManyToOne(() => Parking, { nullable: false })
  // @JoinColumn({ name: "parkingId", referencedColumnName: "id" })
  // parking: Parking;
  // @Column({ type: "string" })
  // public parkingId?: string;

  @ApiProperty()
  @Column({ type: "text", nullable: false, default: "" })
  public name!: string;

  @ApiProperty()
  @Column({ type: "text", nullable: false, default: "" })
  public macAddress!: string;

  @Column({ type: "enum", enum: GateType, default: GateType.IN })
  type: GateType;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: false, default: new Date() })
  public createdAt: Date;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: true })
  public updatedAt: Date;
}

export { Gate };
