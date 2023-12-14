import {
  Body,
  Controller,
  Inject,
  Post,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  Request,
  UseGuards,
  Put,
  Param,
  Delete,
} from "@nestjs/common";
import {
  RegisterDto,
  LoginDto,
  LoginResponseDTO,
  CreateBranchDto,
  CreateOperatingAreaDto,
} from "./auth.dto";
import { ManagementAuthService } from "./auth.service";
import { Branch, Management, OperatingArea } from "@app/entities";
import { TransformInterceptor } from "@app/interceptors";
import {
  ApiResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@ApiBearerAuth()
@ApiTags("Management")
@UseInterceptors(TransformInterceptor)
@Controller("/management")
export class ManagementAuthController {
  @Inject(ManagementAuthService)
  private readonly service: ManagementAuthService;

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiCreatedResponse({ description: "user created" })
  @ApiConflictResponse({ description: "Email already exist" })
  @ApiBadRequestResponse({ description: "Request body not match" })
  @Post("register")
  private async register(@Body() body: RegisterDto): Promise<void | never> {
    await this.service.register(body);
  }

  @ApiResponse({
    status: 200,
    description: "Success Login.",
    type: LoginResponseDTO,
  })
  @Post("login")
  private async login(
    @Body() body: LoginDto,
  ): Promise<{ user: Management; token: string } | never> {
    const response = await this.service.login(body);
    return response;
  }

  @ApiResponse({
    status: 200,
    type: [Management],
  })
  @Get("profile")
  @UseGuards(AuthGuard("management"))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async getManagementProfile(@Request() req: any): Promise<any> {
    return req.management;
  }

  @Post("branch")
  @UseGuards(AuthGuard("management"))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async createBranch(
    @Request() req: any,
    @Body() body: CreateBranchDto,
  ): Promise<any> {
    await this.service.createBranch(body);
  }

  @ApiResponse({
    status: 200,
    type: [Branch],
  })
  @Get("branch")
  @UseGuards(AuthGuard("management"))
  private async getAllBranch(): Promise<Branch[]> {
    return await this.service.getAllBranch();
  }

  @ApiResponse({
    status: 200,
    type: [OperatingArea],
  })
  @Get("operating-area")
  @UseGuards(AuthGuard("management"))
  private async getOperatingArea(): Promise<OperatingArea[]> {
    return await this.service.getAllOperatingArea();
  }

  @Post("operating-area")
  @UseGuards(AuthGuard("management"))
  private async createOperatingArea(
    @Body() body: CreateOperatingAreaDto,
  ): Promise<void> {
    return await this.service.createOperatingArea(body.name);
  }

  @Put("operating-area/:id")
  @UseGuards(AuthGuard("management"))
  private async updateOperatingArea(
    @Body() body: CreateOperatingAreaDto,
    @Param("id") id: string,
  ): Promise<void> {
    return await this.service.updateOperatingArea(id, body.name);
  }

  @Delete("operating-area/:id")
  @UseGuards(AuthGuard("management"))
  private async deleteOperatingArea(@Param("id") id: string): Promise<void> {
    return await this.service.deleteOperatingArea(id);
  }
}
