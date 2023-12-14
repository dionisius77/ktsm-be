import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { CheckInGateDto, CheckOutGateDto } from "./parking.dto";
import { Gate, GateType, ParkingLogs } from "@app/entities";

@Injectable()
export class UserParkingService {
  @InjectRepository(Gate)
  private readonly gateRepository: Repository<Gate>;
  @InjectRepository(ParkingLogs)
  private readonly parkingLogsRepository: Repository<ParkingLogs>;

  public async historyParking(
    userId: string,
    year: number,
    month: number,
  ): Promise<ParkingLogs[]> {
    const history = await this.parkingLogsRepository
      .createQueryBuilder("parkingLogs")
      .innerJoinAndSelect("parkingLogs.vehicle", "vehicle")
      .innerJoinAndSelect("parkingLogs.gateOut", "gateOut")
      .innerJoinAndSelect("parkingLogs.gateIn", "gateIn")
      .innerJoinAndSelect("gateIn.parking", "parkingIn")
      .innerJoinAndSelect("gateOut.parking", "parkingOut")
      .where("vehicle.userId = :userId", { userId })
      .andWhere("parkingLogs.out IS NOT NULL")
      .andWhere("EXTRACT(MONTH FROM parkingLogs.in) = :month", { month })
      .andWhere("EXTRACT(YEAR FROM parkingLogs.in) = :year", { year })
      .orderBy("parkingLogs.in", "DESC")
      .getMany();
    return history;
  }

  public async activeParkingSession(
    userId: string,
  ): Promise<ParkingLogs | null> {
    const activeSession = await this.parkingLogsRepository.findOne({
      where: { vehicle: { userId }, out: IsNull() },
      relations: {
        vehicle: true,
        gateIn: true,
        gateOut: true,
      },
    });
    if (!activeSession) return null;
    return activeSession;
  }

  public async checkIn(userId: string, payload: CheckInGateDto): Promise<void> {
    const activeSession = await this.parkingLogsRepository.findOne({
      where: { vehicle: { userId }, out: IsNull() },
    });
    if (activeSession) {
      throw new HttpException(
        `There's active parking session`,
        HttpStatus.CONFLICT,
      );
    }
    const gate = await this.gateRepository.findOne({
      where: { macAddress: payload.macAdress, type: GateType.IN },
    });
    if (!gate) {
      throw new HttpException(
        `Invalid gate mac address`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const logs = new ParkingLogs();
    logs.gateInId = gate.id;
    logs.vehicleId = payload.vehicleId;
    logs.in = new Date();
    await this.parkingLogsRepository.save(logs);
  }

  public async checkOut(
    userId: string,
    payload: CheckOutGateDto,
  ): Promise<void> {
    const activeSession = await this.parkingLogsRepository.findOne({
      where: { vehicle: { userId }, out: IsNull(), id: payload.sessionId },
    });
    if (!activeSession) {
      throw new HttpException(
        `You don't have permission to out parking gate`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const gate = await this.gateRepository.findOne({
      where: { macAddress: payload.macAdress, type: GateType.OUT },
    });
    if (!gate) {
      throw new HttpException(
        `Invalid gate mac address`,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.parkingLogsRepository.update(
      { id: activeSession.id },
      { gateOutId: gate.id, out: new Date() },
    );
  }
}
