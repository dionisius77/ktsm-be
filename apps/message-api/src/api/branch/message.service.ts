import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, IsNull, Repository } from "typeorm";
import { MessageLogs } from "@app/entities";

@Injectable()
export class BranchMessageService {
  @InjectRepository(MessageLogs)
  private readonly messageLogsRepository: Repository<MessageLogs>;

  public async updateMessageLogs(ids: string[]): Promise<void> {
    await this.messageLogsRepository.update(
      { id: In(ids), deliveredAt: IsNull() },
      { deliveredAt: new Date() },
    );
  }
}
