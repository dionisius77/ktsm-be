import { ApiProperty } from "@nestjs/swagger";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Gate } from "./gate.entity";
import { Vehicle } from "./vehicle.entity";

@Entity()
class ParkingLogs extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @ApiProperty({ type: () => Vehicle })
  @ManyToOne(() => Vehicle, { nullable: false })
  @JoinColumn({ name: "vehicleId", referencedColumnName: "id" })
  vehicle: Vehicle;
  @Column({ type: "string" })
  public vehicleId?: string;

  @ApiProperty({ type: () => Gate })
  @ManyToOne(() => Gate, { nullable: false })
  @JoinColumn({ name: "gateInId", referencedColumnName: "id" })
  gateIn: Gate;
  @Column({ type: "string" })
  public gateInId?: string;

  @ApiProperty({ type: () => Gate })
  @ManyToOne(() => Gate, { nullable: true })
  @JoinColumn({ name: "gateOutId", referencedColumnName: "id" })
  gateOut?: Gate;
  @Column({ type: "string", nullable: true })
  public gateOutId?: string;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: false, default: new Date() })
  public in: Date;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: true })
  public out: Date;
}

export { ParkingLogs };
