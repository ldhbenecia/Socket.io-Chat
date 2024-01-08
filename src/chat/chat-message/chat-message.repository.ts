import { Injectable } from '@nestjs/common';
import { ChatMessage } from '../schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ChatMessageRepository {
  constructor(@InjectModel(ChatMessage.name) private chatMessageModel: Model<ChatMessage>) {}

  async saveMessage(roomName: string, senderId: string, content: string): Promise<ChatMessage> {
    const message = new this.chatMessageModel({ roomName, senderId, content });
    return await message.save();
  }

  async getMessages(roomId: string): Promise<ChatMessage[]> {
    return this.chatMessageModel.find({ roomId }).exec();
  }
}
