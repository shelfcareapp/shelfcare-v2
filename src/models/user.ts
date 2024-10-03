import mongoose, { InferSchemaType, model, Schema } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  birthday: {
    type: Date
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  postal_code: {
    type: String
  },
  floor: {
    type: String
  },
  door_info: {
    type: String
  }
});

type User = InferSchemaType<typeof UserSchema>;

export default mongoose.models.User || model<User>('User', UserSchema);
