import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class SuperAdmin extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @ApiProperty()
  @Column({ type: "text", nullable: false, unique: true })
  public email!: string;

  @ApiProperty()
  @Exclude()
  @Column({ type: "text", nullable: true })
  public password: string;

  @ApiProperty()
  @Column({ type: "text", nullable: false, default: "" })
  public username!: string;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: false, default: new Date() })
  public createdAt!: Date;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: true })
  public updatedAt: Date;
}

export { SuperAdmin };
