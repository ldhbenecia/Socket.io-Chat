import { Injectable } from '@nestjs/common';
import { ChatRoomRepository } from './chat-room.repository';
import { ChatRoom } from '../schema';

@Injectable()
export class ChatRoomService {
  constructor(private chatRoomRepository: ChatRoomRepository) {}

  async createChatRoom(userId: string, roomName: string): Promise<ChatRoom> {
    return await this.chatRoomRepository.createChatRoom(userId, roomName);
  }

  async joinChatRoom(userId: string, roomName: string): Promise<ChatRoom> {
    return await this.chatRoomRepository.joinChatRoom(userId, roomName);
  }

  async leaveChatRoom(userId: string, roomName: string): Promise<ChatRoom> {
    return await this.chatRoomRepository.leaveChatRoom(userId, roomName);
  }
}
