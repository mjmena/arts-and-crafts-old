import mongoose from 'mongoose';

let PaymentSchema = new mongoose.Schema({
  type: String,
  description: String,
  amount: Number,
  date: Date
});
PaymentSchema.set('toJSON', {getters: true});

export default mongoose.model('Payment', PaymentSchema);