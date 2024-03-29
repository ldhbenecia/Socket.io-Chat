import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatRoomService } from './chat-room/chat-room.service';
import { ChatMessageService } from './chat-message/chat-message.service';

@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: ['http://localhost:4000'] },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger('ChatGateway');

  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly chatMessageService: ChatMessageService,
  ) {}

  afterInit() {
    this.logger.log('WebSocket initialized 3000/chat ✅');
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('createRoom')
  async createRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomName: string }): Promise<void> {
    const { roomName } = data;
    const createdRoom = await this.chatRoomService.createChatRoom(client.id, roomName);
    client.join(roomName);
    this.logger.log(`Client ${client.id} created room: ${createdRoom.roomName}`);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: { roomName: string }): Promise<void> {
    const { roomName } = payload;

    client.join(roomName);
    await this.chatRoomService.joinChatRoom(client.id, roomName);
    this.logger.log(`Client ${client.id} joined room: ${roomName}`);

    client.broadcast.emit('message', {
      message: `${client.id}가 채팅방에 참여했습니다.`,
    });
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: { roomName: string }): Promise<void> {
    const { roomName } = payload;

    client.leave(roomName);
    this.logger.log(`Client ${client.id} left room: ${roomName}`);
    await this.chatRoomService.leaveChatRoom(client.id, roomName);

    client.broadcast.emit('message', {
      message: `${client.id}가 채팅방에서 퇴장하셨습니다.`,
    });
  }

  @SubscribeMessage('sendMessage')
  async onSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomName: string; content: string },
  ): Promise<void> {
    const { roomName, content } = payload;
    const message = await this.chatMessageService.saveMessage(roomName, client.id, content);
    //console.log(`Message saved successfully: ${JSON.stringify(message)}`);

    // 현재 클라이언트를 제외한 같은 방에 있는 모든 클라이언트에게 메시지 브로드캐스트
    client.broadcast.to(roomName).emit('message', {
      roomName: roomName,
      sender: client.id,
      contents: message.content,
      timeStamp: message.timestamp,
    });
  }

  @SubscribeMessage('getMessages')
  async onGetMessages(@ConnectedSocket() client: Socket, @MessageBody() payload: { roomName: string }): Promise<void> {
    const { roomName } = payload;

    const messages = await this.chatMessageService.getMessages(roomName);
    client.emit('message', messages);
  }
}
