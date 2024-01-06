import { Logger } from '@nestjs/common';
import {
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

@WebSocketGateway(80)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger('Chat');

  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly chatMessageService: ChatMessageService,
  ) {}

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

  // message Test
  @SubscribeMessage('newMessage')
  onNewMessage(client: Socket, @MessageBody() body: any) {
    console.log(body);
    this.server.emit('onMessage', {
      msg: 'New Message',
      sender: client,
      content: body,
    });
  }

  // 메시지 전송
  @SubscribeMessage('sendMessage')
  async onSendMessage(client: Socket, @MessageBody() payload: { roomId: string; contents: string }): Promise<void> {
    const { roomId, contents } = payload;

    // 메시지를 저장하고
    const message = await this.chatMessageService.saveMessage(roomId, client.id, contents);

    // 같은 채팅방의 모든 클라이언트에게 메시지 전송
    this.server.to(roomId).emit('message', {
      sender: client.id,
      contents: message.contents,
      timeStamp: message.timestamp,
    });
  }

  // 채팅방의 메시지 불러오기
  @SubscribeMessage('getMessages')
  async onGetMessages(client: Socket, @MessageBody() payload: { roomId: string }): Promise<void> {
    const { roomId } = payload;

    // 채팅방의 모든 메시지를 불러오고 클라이언트에게 전송
    const messages = await this.chatMessageService.getMessages(roomId);
    client.emit('messages', messages);
  }
}
