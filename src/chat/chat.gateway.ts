import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatRoomService } from './chat-room/chat-room.service';

@WebSocketGateway(80, { namespace: 'chat-room' })
@WebSocketGateway({ path: '/chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger('Chat-room');

  constructor(private readonly chatRoomService: ChatRoomService) {}

  afterInit() {
    this.logger.log('WebSocket initialized 80 ✅');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('welcome', 'Welcome to the chat room!');
    this.server.emit('userConnected', `${client.id} joined the chat`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.server.emit('userDisconnected', `${client.id} left the chat`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { roomId: string; message: string }): void {
    console.log(`Received message from client ${client.id}: ${payload.message}`);

    // 같은 채팅방의 모든 클라이언트에게 메시지 전송
    this.server.to(payload.roomId).emit('message', payload.message);
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom(client: Socket, payload: { name: string; participants: string[] }): Promise<void> {
    const { name, participants } = payload;
    const chatRoom = await this.chatRoomService.createChatRoom(name, participants);

    this.server.emit('Created new ChatRoom', chatRoom);
  }
}
