import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatMessage, ChatRoom } from '../schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ChatMessageRepository {
  constructor(
    @InjectModel(ChatMessage.name) private chatMessageModel: Model<ChatMessage>,
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
  ) {}

  async saveMessage(roomName: string, senderId: string, content: string): Promise<ChatMessage> {
    const existingRoom = await this.chatRoomModel.findOne({ roomName }).exec();

    if (!existingRoom) {
      throw new NotFoundException(`Chat room '${roomName}' not found`);
    }

    const message = new this.chatMessageModel({ roomName, senderId, content });
    return await message.save();
  }

  async getMessages(roomName: string): Promise<ChatMessage[]> {
    return this.chatMessageModel.find({ roomName }).exec();
  }
}
