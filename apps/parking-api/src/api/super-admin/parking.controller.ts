/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Controller,
  Inject,
  UseInterceptors,
  Get,
  Param,
  UseGuards,
  Post,
  Body,
  Put,
} from "@nestjs/common";
import { SuperAdminParkingService } from "./parking.service";
import { TransformInterceptor } from "@app/interceptors";
import {
  ApiResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiTags,
} from "@nestjs/swagger";
import { Parking } from "@app/entities/operating-area.entity";
import { AuthGuard } from "@nestjs/passport";
import {
  CreateGateDto,
  CreateParkingDto,
  UpdateParkingDto,
} from "./parking.dto";
import { SuperAdminGateService } from "./gate.service";
import { Gate } from "@app/entities";

@ApiBearerAuth()
@ApiTags("Super Admin")
@UseInterceptors(TransformInterceptor)
@Controller("/super-admin")
export class SuperAdminParkingController {
  @Inject(SuperAdminParkingService)
  private readonly service: SuperAdminParkingService;
  @Inject(SuperAdminGateService)
  private readonly gateService: SuperAdminGateService;

  // Start Parking Data Handler
  @ApiResponse({
    status: 200,
    description: "Successfully create parking place.",
  })
  @UseGuards(AuthGuard("superadmin"))
  @Post("/")
  private async createParking(
    @Body() body: CreateParkingDto,
  ): Promise<void | never> {
    await this.service.createParkingAndAdmin(body);
  }

  @ApiResponse({
    status: 200,
    description: "Successfully update parking place.",
  })
  @ApiNotFoundResponse({ description: "Data not found." })
  @UseGuards(AuthGuard("superadmin"))
  @Put("/:id")
  private async updateParking(
    @Body() body: UpdateParkingDto,
    @Param("id") id: string,
  ): Promise<void | never> {
    await this.service.updateParking(id, body);
  }

  @ApiResponse({
    status: 200,
    description: "Successfully retrieved data.",
    type: [Parking],
  })
  @UseGuards(AuthGuard("superadmin"))
  @Get("/")
  private async getParkingList(): Promise<Parking[] | never> {
    return await this.service.getParkingList();
  }

  @ApiResponse({
    status: 200,
    description: "Successfully retrieved data.",
    type: Parking,
  })
  @ApiNotFoundResponse({ description: "Data not found." })
  @UseGuards(AuthGuard("superadmin"))
  @Get("/:id")
  private async getParkingDetail(
    @Param("id") id: string,
  ): Promise<Parking | never> {
    return await this.service.getParkingDetail(id);
  }
  // End Parking Data Handler
  // Start Parking Gate Handler
  @ApiResponse({
    status: 200,
    description: "Successfully create parking place.",
  })
  @UseGuards(AuthGuard("superadmin"))
  @Post("/:parkingId/gate")
  private async createGate(
    @Body() body: CreateGateDto,
    @Param("parkingId") id: string,
  ): Promise<void | never> {
    await this.gateService.createGate(id, body);
  }

  @ApiResponse({
    status: 200,
    description: "Successfully retrieved data.",
    type: [Gate],
  })
  @UseGuards(AuthGuard("superadmin"))
  @Get("/:parkingId/gate")
  private async getGateList(
    @Param("parkingId") id: string,
  ): Promise<Gate[] | never> {
    return await this.gateService.getGateList(id);
  }
  // End Parking Gate Handler
}
