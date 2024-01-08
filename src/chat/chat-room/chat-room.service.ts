import { Injectable } from '@nestjs/common';
import { ChatRoomRepository } from './chat-room.repository';
import { ChatRoom } from '../schema';

@Injectable()
export class ChatRoomService {
  constructor(private chatRoomRepository: ChatRoomRepository) {}

  // 단체 채팅방 생성
  // async createChatRoom(name: string, participants: string[]): Promise<ChatRoom> {
  //   return this.chatRoomRepository.createChatRoom(name, participants);
  // }

  // 1:1 채팅방 생성
  async createPrivateChatRoom(userId: string, roomName: string): Promise<ChatRoom> {
    return await this.chatRoomRepository.createPrivateChatRoom(userId, roomName);
  }
}
