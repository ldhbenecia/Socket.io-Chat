import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ChatRoom } from './chat-room.schema';

export type ChatMessageDocument = HydratedDocument<ChatMessage>;

// 240104 ldhbenecia || 클래스 사용
@Schema({ collection: 'chatmessages' })
export class ChatMessage {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' })
  roomId: ChatRoom;

  @Prop({ type: String })
  roomName: string;

  @Prop({ type: String, ref: 'User' })
  senderId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
