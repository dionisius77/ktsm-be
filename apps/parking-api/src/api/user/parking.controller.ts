/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Controller,
  Inject,
  UseInterceptors,
  UseGuards,
  Post,
  Body,
  Request,
  Get,
  Delete,
  Param,
  Put,
} from "@nestjs/common";
import { UserVehicleService } from "./vehicle.service";
import { TransformInterceptor } from "@app/interceptors";
import { ApiResponse, ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import {
  CheckInGateDto,
  CheckOutGateDto,
  CreateVehicleDto,
} from "./parking.dto";
import { ParkingLogs, User, Vehicle } from "@app/entities";
import { UserParkingService } from "./parking.service";

@ApiBearerAuth()
@ApiTags("User")
@UseInterceptors(TransformInterceptor)
@Controller("/user")
export class UserParkingController {
  @Inject(UserVehicleService)
  private readonly service: UserVehicleService;
  @Inject(UserParkingService)
  private readonly parkingService: UserParkingService;

  // Start Vehicle Data Handler
  @ApiResponse({
    status: 201,
    description: "Successfully create vehicle.",
  })
  @UseGuards(AuthGuard("user"))
  @Post("/vehicle")
  private async createVehicle(
    @Body() body: CreateVehicleDto,
    @Request() req: any,
  ): Promise<void | never> {
    const userContext: User = <User>req.user;
    await this.service.createVehicle(userContext.id, body);
  }

  @ApiResponse({
    status: 200,
    type: [Vehicle],
  })
  @UseGuards(AuthGuard("user"))
  @Get("/vehicle")
  private async getVehicle(@Request() req: any): Promise<Vehicle[]> {
    const userContext: User = <User>req.user;
    return await this.service.getVehicle(userContext.id);
  }

  @ApiResponse({
    status: 201,
    description: "Successfully delete vehicle.",
  })
  @UseGuards(AuthGuard("user"))
  @Delete("/vehicle/:id")
  private async deleteVehicle(@Param("id") id: string): Promise<void> {
    await this.service.deleteVehicle(id);
  }

  @ApiResponse({
    status: 201,
    description: "Successfully update vehicle.",
  })
  @UseGuards(AuthGuard("user"))
  @Put("/vehicle/:id")
  private async updateVehicle(
    @Param("id") id: string,
    @Request() req: any,
    @Body() body: CreateVehicleDto,
  ): Promise<void> {
    const userContext: User = <User>req.user;
    await this.service.udpateVehicle(userContext.id, id, body);
  }

  // End Vehicle Data Handler
  // Start Parking Handler

  @ApiResponse({
    status: 200,
    type: ParkingLogs,
  })
  @UseGuards(AuthGuard("user"))
  @Get("/active-session")
  private async getActiveSession(
    @Request() req: any,
  ): Promise<ParkingLogs | null> {
    const userContext: User = <User>req.user;
    return await this.parkingService.activeParkingSession(userContext.id);
  }

  @ApiResponse({
    status: 201,
    description: "Successfully check in parking.",
  })
  @UseGuards(AuthGuard("user"))
  @Post("/check-in")
  private async checkIn(
    @Body() body: CheckInGateDto,
    @Request() req: any,
  ): Promise<void | never> {
    const userContext: User = <User>req.user;
    await this.parkingService.checkIn(userContext.id, body);
  }

  @ApiResponse({
    status: 201,
    description: "Successfully check out parking.",
  })
  @UseGuards(AuthGuard("user"))
  @Post("/check-out")
  private async checkOut(
    @Body() body: CheckOutGateDto,
    @Request() req: any,
  ): Promise<void | never> {
    const userContext: User = <User>req.user;
    await this.parkingService.checkOut(userContext.id, body);
  }

  @ApiResponse({
    status: 200,
    type: [ParkingLogs],
  })
  @UseGuards(AuthGuard("user"))
  @Get("/history/:month/:year")
  private async getParkingHistory(
    @Request() req: any,
    @Param("month") month: number,
    @Param("year") year: number,
  ): Promise<ParkingLogs[]> {
    const userContext: User = <User>req.user;
    return await this.parkingService.historyParking(
      userContext.id,
      year,
      month,
    );
  }
}
