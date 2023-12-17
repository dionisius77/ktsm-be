import {
  Controller,
  Inject,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Put,
  Body,
} from "@nestjs/common";
import { BranchMessageService } from "./message.service";
import { TransformInterceptor } from "@app/interceptors";
import {
  ApiTags,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { ReadMessageDto } from "./message.dto";

@ApiBearerAuth()
@ApiTags("Branch")
@UseInterceptors(TransformInterceptor)
@Controller("/branch")
export class BranchMessageController {
  @Inject(BranchMessageService)
  private readonly service: BranchMessageService;

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard("branch"))
  @Put("messages/open")
  private async updateMessage(@Body() body: ReadMessageDto) {
    return await this.service.updateMessageLogs(body.ids);
  }
}
