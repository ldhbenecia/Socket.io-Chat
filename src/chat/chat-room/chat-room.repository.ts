import { Injectable } from '@nestjs/common';
import { ChatRoom } from '../schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ChatRoomRepository {
  constructor(@InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>) {}

  async createChatRoom(userId: string, roomName: string): Promise<ChatRoom> {
    const participantIds = [userId];

    const room = new this.chatRoomModel({ roomName, participants: participantIds });
    return await room.save();
  }

  async joinChatRoom(userId: string, roomName: string): Promise<ChatRoom> {
    const existingRoom = await this.chatRoomModel.findOne({ roomName });
    if (!existingRoom) {
      throw new Error(`Chat room with name ${roomName} does not exist.`);
    }

    existingRoom.participants.push(userId);

    return await existingRoom.save();
  }
}
