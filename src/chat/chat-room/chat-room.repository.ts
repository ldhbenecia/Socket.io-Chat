import { Injectable } from '@nestjs/common';
import { ChatRoom } from '../schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

@Injectable()
export class ChatRoomRepository {
  constructor(@InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>) {}

  // async createChatRoom(name: string, participants: string[]): Promise<ChatRoom> {
  //   const participantIds = participants.map((userId) => new Types.ObjectId(userId));

  //   const room = new this.chatRoomModel({ name, participants: participantIds });
  //   return await room.save();
  // }

  async createPrivateChatRoom(userId: string, roomName: string): Promise<ChatRoom> {
    const participantIds = [new Types.ObjectId(userId)];

    const room = new this.chatRoomModel({ name: roomName, participants: participantIds });
    return await room.save();
  }
}
