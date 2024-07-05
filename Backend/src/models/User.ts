import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  avatarUrl: string;
}

const userSchema: Schema = new Schema({
  username: { type: String, required: true },
  avatarUrl: { type: String, required: false }
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
