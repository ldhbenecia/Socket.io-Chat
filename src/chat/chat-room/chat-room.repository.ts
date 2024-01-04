import { Injectable } from '@nestjs/common';
import { ChatRoom } from '../schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ChatRoomRepository {
  constructor(@InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>) {}

  async createChatRoom(name: string, participants: string[]): Promise<ChatRoom> {
    const room = new this.chatRoomModel({ name, participants });
    return await room.save();
  }
}
