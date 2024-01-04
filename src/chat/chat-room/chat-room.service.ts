import { Injectable } from '@nestjs/common';
import { ChatRoomRepository } from './chat-room.repository';
import { ChatRoom } from '../schema';

@Injectable()
export class ChatRoomService {
  constructor(private chatRoomRepository: ChatRoomRepository) {}

  async createChatRoom(name: string, participants: string[]): Promise<ChatRoom> {
    return this.chatRoomRepository.createChatRoom(name, participants);
  }
}
