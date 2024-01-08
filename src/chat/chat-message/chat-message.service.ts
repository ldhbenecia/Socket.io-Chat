import { Injectable } from '@nestjs/common';
import { ChatMessageRepository } from './chat-message.repository';
import { ChatMessage } from '../schema';

@Injectable()
export class ChatMessageService {
  constructor(private chatMessageRepository: ChatMessageRepository) {}

  async saveMessage(roomName: string, senderId: string, content: string): Promise<ChatMessage> {
    return await this.chatMessageRepository.saveMessage(roomName, senderId, content);
  }

  async getMessages(roomId: string): Promise<ChatMessage[]> {
    return await this.chatMessageRepository.getMessages(roomId);
  }
}
