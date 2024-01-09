import { ForbiddenException, Injectable } from '@nestjs/common';
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
      throw new ForbiddenException(`Chat room with name ${roomName} does not exist.`);
    }

    if (existingRoom.participants.includes(userId)) {
      throw new ForbiddenException(`User with ID ${userId} is already in the chat room.`);
    }

    existingRoom.participants.push(userId);

    return await existingRoom.save();
  }
}
