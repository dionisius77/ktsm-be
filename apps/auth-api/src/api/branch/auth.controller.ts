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
} from "@nestjs/common";
import {
  AdminLoginDto,
  AdminLoginResponseDTO,
  AdminResetPasswordDTO,
} from "./auth.dto";
import { BranchAuthService } from "./auth.service";
import { Branch } from "@app/entities";
import { TransformInterceptor } from "@app/interceptors";
import {
  ApiResponse,
  ApiBadRequestResponse,
  ApiTags,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@ApiBearerAuth()
@ApiTags("Branch")
@UseInterceptors(TransformInterceptor)
@Controller("/branch")
export class BranchAuthController {
  @Inject(BranchAuthService)
  private readonly service: BranchAuthService;

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 201, description: "Success change Password" })
  @ApiBadRequestResponse({
    description: "Token Invalid OR password not strong enough",
  })
  @Post("reset-password")
  @UseGuards(AuthGuard("branch"))
  private async resetPassword(
    @Request() req: any,
    @Body() body: AdminResetPasswordDTO,
  ): Promise<void | never> {
    await this.service.changePassword(req.branch.id, body);
  }

  @ApiResponse({
    status: 200,
    description: "Success Login.",
    type: AdminLoginResponseDTO,
  })
  @Post("login")
  private async login(
    @Body() body: AdminLoginDto,
  ): Promise<{ user: Branch; token: string } | never> {
    const response = await this.service.login(body);
    return response;
  }

  @Get("profile")
  @UseGuards(AuthGuard("branch"))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async getBranchProfile(@Request() req: any): Promise<any> {
    return req.branch;
  }
}
