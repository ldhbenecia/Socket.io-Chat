import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessageSchema, ChatRoomSchema } from './schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ChatRoom', schema: ChatRoomSchema }]),
    MongooseModule.forFeature([{ name: 'ChatMessage', schema: ChatMessageSchema }]),
  ],
  providers: [ChatGateway],
})
export class ChatModule {}
