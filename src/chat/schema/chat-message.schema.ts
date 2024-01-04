import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ChatMessageDocument = HydratedDocument<ChatMessage>;

// 240104 ldhbenecia || 클래스 사용
@Schema()
export class ChatMessage {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' })
  roomId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  senderId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  contents: string;

  @Prop({ required: true })
  timestamp: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
