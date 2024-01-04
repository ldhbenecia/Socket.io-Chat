import * as mongoose from 'mongoose';

// 240104 ldhbenecia || 객체 리터럴 사용
export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
});
