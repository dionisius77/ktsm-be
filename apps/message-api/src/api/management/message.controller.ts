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
  Query,
} from "@nestjs/common";
import { ManagementMessageService } from "./message.service";
import { TransformInterceptor } from "@app/interceptors";
import {
  ApiResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import {
  CreateMessageDto,
  PagingDto,
  UpdateMessageDto,
  UpdateMessageLogsDto,
} from "./message.dto";
import { Message, MessageLogs } from "@app/entities";

@ApiBearerAuth()
@ApiTags("Management")
@UseInterceptors(TransformInterceptor)
@Controller("/management")
export class ManagementMessageController {
  @Inject(ManagementMessageService)
  private readonly service: ManagementMessageService;

  @ApiResponse({
    status: 200,
    description: "Successfully retrieved data.",
    type: [Message],
  })
  @UseGuards(AuthGuard("management"))
  @Get("/messages")
  private async getMessageList(@Query() query: PagingDto): Promise<Message[]> {
    return await this.service.getMessages();
  }

  @ApiResponse({
    status: 200,
    description: "Successfully retrieved data.",
    type: Message,
  })
  @ApiNotFoundResponse({ description: "Data not found." })
  @UseGuards(AuthGuard("management"))
  @Get("messages/:id")
  private async getMessageDetail(@Param("id") id: string): Promise<Message> {
    return await this.service.getMessageById(id);
  }

  @UseGuards(AuthGuard("management"))
  @Post("messages")
  private async createMessage(@Body() body: CreateMessageDto) {
    return await this.service.createMessage(body);
  }

  @UseGuards(AuthGuard("management"))
  @Put("messages/:id")
  private async updateMessage(
    @Param("id") id: string,
    @Body() body: UpdateMessageDto,
  ) {
    return await this.service.updateMessage(id, body);
  }

  @UseGuards(AuthGuard("management"))
  @Put("message-logs/:id")
  private async updateMessageLogs(
    @Param("id") id: string,
    @Body() body: UpdateMessageLogsDto,
  ) {
    return await this.service.updateMessageLogs(id, body);
  }

  @ApiResponse({
    status: 200,
    description: "Successfully retrieved data.",
    type: [MessageLogs],
  })
  @UseGuards(AuthGuard("management"))
  @Get("message-logs/:messageId")
  private async getMessageLogs(@Param("messageId") messageId: string) {
    return await this.service.getMessageLogsByMessageId(messageId);
  }
}
