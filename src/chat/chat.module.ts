import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { ChatRoomSchema, ChatMessageSchema, ChatRoom, ChatMessage } from './schema';
import { ChatRoomService } from './chat-room/chat-room.service';
import { ChatRoomRepository } from './chat-room/chat-room.repository';
import { ChatMessageRepository } from './chat-message/chat-message.repository';
import { ChatMessageService } from './chat-message/chat-message.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ChatRoom.name, schema: ChatRoomSchema }]),
    MongooseModule.forFeature([{ name: ChatMessage.name, schema: ChatMessageSchema }]),
  ],
  providers: [ChatGateway, ChatRoomService, ChatRoomRepository, ChatMessageService, ChatMessageRepository],
})
export class ChatModule {}
