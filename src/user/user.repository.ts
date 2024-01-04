import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interface/user.interface';
import { CreateUserDto } from './dto/create-user.dto';

export class UserRepository {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }
}
