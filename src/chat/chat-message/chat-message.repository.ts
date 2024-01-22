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

    // 해당 유저가 채팅방 참가자가 아닌 경우 메세지 전송 불가능 (원활한 개발 진행을 위해 주석 처리)
    // if (!existingRoom.participants.includes(senderId)) {
    //   throw new NotFoundException(`User '${senderId}' is not a participant in chat room '${roomName}'`);
    // }

    const message = new this.chatMessageModel({
      roomId: existingRoom,
      roomName,
      senderId,
      content,
    });
    return await message.save();
  }

  async getMessages(roomName: string): Promise<ChatMessage[]> {
    return this.chatMessageModel.find({ roomName }).populate('roomId').exec();
  }
}
