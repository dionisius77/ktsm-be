import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { BranchAuthService } from '../branch/auth.service';

@Injectable()
export class SocketService {
  private readonly connectedClients: Map<string, Socket> = new Map();
  @Inject(BranchAuthService)
  private readonly service: BranchAuthService;

  async handleConnection(socket: Socket, userId: string): Promise<void> {
    const clientId = socket.id;
    const branch = await this.service.getBranchById(userId);
    if (branch.length > 0) {
      this.connectedClients.set(clientId, socket);
      await this.service.branchOnline(userId, clientId);
    } else {
      this.connectedClients.delete(clientId);
    }

    socket.on('disconnect', async () => {
      await this.service.branchOffline(clientId);
      this.connectedClients.delete(clientId);
    });
  }
}