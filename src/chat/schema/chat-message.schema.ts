import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatMessageDocument = HydratedDocument<ChatMessage>;

// 240104 ldhbenecia || 클래스 사용
@Schema({ collection: 'chatmessages' })
export class ChatMessage {
  @Prop({ type: String, ref: 'ChatRoom' })
  roomName: string;

  @Prop({ type: String, ref: 'User' })
  senderId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
