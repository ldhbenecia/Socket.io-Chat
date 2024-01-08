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
  cors: {
    origin: ['http://localhost:4000'], // Client
  },
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

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.broadcast.emit('message', {
      message: `${client.id}가 들어왔습니다.`,
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // 1:1 채팅방 생성
  @SubscribeMessage('createPrivateRoom')
  async handleCreatePrivateRoom(client: Socket, @MessageBody() roomName: string): Promise<void> {
    await this.chatRoomService.createPrivateChatRoom(client.id, roomName);
  }

  // 단체 채팅방 생성
  // @SubscribeMessage('createRoom')
  // async handleCreateRoom(client: Socket, payload: { name: string; participants: string[] }): Promise<void> {
  //   const { name, participants } = payload;
  //   const chatRoom = await this.chatRoomService.createChatRoom(name, participants);

  //   // 단체 채팅방 생성 메시지 전송
  //   this.server.emit('Created new ChatRoom', chatRoom);
  // }

  @SubscribeMessage('message')
  async onSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; content: string },
  ): Promise<void> {
    const { roomId, content } = payload;
    const message = await this.chatMessageService.saveMessage(roomId, client.id, content);

    // 현재 클라이언트를 제외한 같은 방에 있는 모든 클라이언트에게 메시지 브로드캐스트
    client.broadcast.to(roomId).emit('message', {
      sender: client.id,
      contents: message.content,
      timeStamp: message.timestamp,
    });
  }

  @SubscribeMessage('getMessages')
  async onGetMessages(client: Socket, @MessageBody() payload: { roomId: string }): Promise<void> {
    const { roomId } = payload;

    const messages = await this.chatMessageService.getMessages(roomId);
    client.emit('messages', messages);
  }
}
