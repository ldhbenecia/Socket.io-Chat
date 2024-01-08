import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

// 240104 ldhbenecia || 클래스 사용
@Schema({ collection: 'chatrooms' })
export class ChatRoom {
  @Prop({ required: true })
  roomName: string;

  @Prop({ required: true, type: [String], default: [] })
  participants: string[];
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
