import mongoose from 'mongoose';

let ServiceSchema = new mongoose.Schema({
  description: String,
  cost: Number,
  date: Date
});

ServiceSchema.set('toJSON', {getters: true});

export default mongoose.model('Service', ServiceSchema);