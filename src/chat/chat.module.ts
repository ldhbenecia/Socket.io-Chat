import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessageSchema, ChatRoomSchema } from './schema';
import { ChatRoomService } from './chat-room/chat-room.service';
import { ChatRoomRepository } from './chat-room/chat-room.repository';
import { ChatMessageRepository } from './chat-message/chat-message.repository';
import { ChatMessageService } from './chat-message/chat-message.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ChatRoom', schema: ChatRoomSchema }]),
    MongooseModule.forFeature([{ name: 'ChatMessage', schema: ChatMessageSchema }]),
  ],
  providers: [ChatGateway, ChatRoomService, ChatRoomRepository, ChatMessageService, ChatMessageRepository],
})
export class ChatModule {}
