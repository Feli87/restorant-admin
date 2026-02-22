import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/notifications',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ): void {
    client.join(room);
    console.log(`Client ${client.id} joined room: ${room}`);
    client.emit('joined-room', { room, message: `Successfully joined room: ${room}` });
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ): void {
    client.leave(room);
    console.log(`Client ${client.id} left room: ${room}`);
    client.emit('left-room', { room, message: `Successfully left room: ${room}` });
  }

  sendToRoom(room: string, event: string, data: any): void {
    this.server.to(room).emit(event, data);
  }

  sendToAll(event: string, data: any): void {
    this.server.emit(event, data);
  }
}
