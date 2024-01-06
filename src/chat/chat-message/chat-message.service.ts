import { Injectable } from '@nestjs/common';
import { ChatMessageRepository } from './chat-message.repository';
import { ChatMessage } from '../schema';

@Injectable()
export class ChatMessageService {
  constructor(private chatMessageRepository: ChatMessageRepository) {}

  async saveMessage(roomId: string, senderId: string, content: string): Promise<ChatMessage> {
    return this.chatMessageRepository.saveMessage(roomId, senderId, content);
  }

  async getMessages(roomId: string): Promise<ChatMessage[]> {
    return this.chatMessageRepository.getMessages(roomId);
  }
}
