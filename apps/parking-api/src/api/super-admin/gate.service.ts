import { Gate } from "@app/entities/gate.entity";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateGateDto } from "./parking.dto";
import { ClientGrpc } from "@nestjs/microservices";

@Injectable()
export class SuperAdminGateService {
  @InjectRepository(Gate)
  private readonly gateRepository: Repository<Gate>;

  constructor(@Inject("AUTH_PACKAGE") private client: ClientGrpc) {}

  public async createGate(
    parkingId: string,
    payload: CreateGateDto,
  ): Promise<void> {
    const { name, macAddress, type } = payload;
    const parking = new Gate();
    parking.name = name;
    parking.macAddress = macAddress;
    parking.type = type;
    parking.parkingId = parkingId;
    parking.createdAt = new Date();
    const saved = await this.gateRepository.save(parking);
    if (!saved) {
      throw new HttpException(
        "Failed create gate",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getGateList(parkingId: string): Promise<Gate[]> {
    return this.gateRepository.find({ where: { parkingId } });
  }
}
