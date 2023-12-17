import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { SocketService } from "./socket.service";
// import { UseGuards } from "@nestjs/common";
// import { AuthGuard } from "@nestjs/passport";

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Socket;

  constructor(private readonly socketService: SocketService) {}

  // @UseGuards(AuthGuard("branch"))
  handleConnection(socket: Socket): void {
    this.socketService.handleConnection(socket, socket.handshake.query.id.toString());
  }
}
