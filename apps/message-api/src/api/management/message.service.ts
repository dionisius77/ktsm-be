import { Message } from "@app/entities/message.entity";
import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, LessThanOrEqual, Repository } from "typeorm";
import {
  CreateMessageDto,
  MessageFirestore,
  UpdateMessageDto,
  UpdateMessageLogsDto,
} from "./message.dto";
import { Cron, CronExpression } from "@nestjs/schedule";
import { MessageLogs } from "@app/entities";
import { dbFirestore } from "../../common/helper/firebase";

@Injectable()
export class ManagementMessageService {
  @InjectRepository(MessageLogs)
  private readonly messageLogsRepository: Repository<MessageLogs>;
  @InjectRepository(Message)
  private readonly messageRepository: Repository<Message>;
  private readonly logger = new Logger(ManagementMessageService.name);

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug("Cron Start Execute");
    const unsentMessage = await this.messageLogsRepository.find({
      where: {
        isBroadcasted: false,
        broadcastedAt: LessThanOrEqual(new Date()),
      },
      relations: {
        message: true,
        branch: true,
      }
    });
    if (unsentMessage.length > 0) {
      let batch = dbFirestore.batch();
      unsentMessage.forEach((item) => {
        const docRef = dbFirestore.collection("messages").doc(item.id);
        const data: MessageFirestore = {
          title: item.message.title,
          branchId: item.branchId,
          contentType: item?.contentType ?? item.message.contentType,
          content: item?.content ?? item.message.content,
          createdAt: item?.broadcastedAt,
        }
        batch.set(docRef, data);
      });
      batch.commit();
      const unsentMessageIds = unsentMessage.map(item => item.id);
      await this.messageLogsRepository.update(
        { id: In(unsentMessageIds) },
        { isBroadcasted: true },
      );
    }

    const expiredMessage = await this.messageLogsRepository.find({
      where: {
        isBroadcasted: true,
        expiredAt: LessThanOrEqual(new Date()),
      },
    });

    if (expiredMessage.length > 0) {
      let batch = dbFirestore.batch();
      expiredMessage.forEach(item => {
        const docRef = dbFirestore.collection("messages").doc(item.id);
        batch.delete(docRef);
      });
      batch.commit();
    }
  }

  public async createMessage(payload: CreateMessageDto): Promise<void> {
    const { title, content, branches, contentType } = payload;
    const message = new Message();
    message.title = title;
    message.contentType = contentType;
    message.content = content;
    message.createdAt = new Date();
    const saved = await this.messageRepository.save(message);
    if (saved) {
      let messages: MessageLogs[] = [];
      branches.forEach((item) => {
        const newLog = new MessageLogs();
        newLog.messageId = saved.id;
        newLog.branchId = item.id;
        newLog.createdAt = new Date();
        newLog.broadcastedAt = item.broadcastAt;
        newLog.expiredAt = item.expiredAt;
        messages.push(newLog);
      });
      const logs = await this.messageLogsRepository.save(messages);
    }
  }

  public async updateMessage(
    id: string,
    payload: UpdateMessageDto,
  ): Promise<void> {
    await this.messageRepository.update(id, {
      contentType: payload.contentType,
      content: payload.content,
      updatedAt: new Date(),
    });
  }

  public async getMessages(): Promise<Message[]> {
    return await this.messageRepository.find({ order: { createdAt: "DESC" } });
  }

  public async getMessageById(id: string): Promise<Message> {
    return await this.messageRepository.findOne({ where: { id } });
  }

  public async updateMessageLogs(id: string, body: UpdateMessageLogsDto) {
    const logs = await this.messageLogsRepository.findOne({ where: { id } });
    if (!logs) {
      throw new HttpException(
        "Invalid message logs ID!",
        HttpStatus.BAD_REQUEST,
      );
    }
    const { broadcastAt, expiredAt, content, contentType } = body;
    const updateData: Partial<MessageLogs> = {
      broadcastedAt: broadcastAt,
      expiredAt: expiredAt,
    }
    if (content) {
      updateData.content = content;
    }
    if (contentType) {
      updateData.contentType = contentType;
    }
    await this.messageLogsRepository.update(id, {
      broadcastedAt: broadcastAt,
      expiredAt: expiredAt,
      content,
      contentType,
    });
  }

  public async getMessageLogsByMessageId(id: string): Promise<MessageLogs[]> {
    const logs = await this.messageLogsRepository.find({
      where: { messageId: id },
      relations: { branch: true },
      order: { branch: { name: "ASC" } },
    });
    return logs;
  }
}
