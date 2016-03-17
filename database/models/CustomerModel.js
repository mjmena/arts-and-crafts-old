import mongoose from 'mongoose';
import AddressModel from './AddressModel';
import PaymentModel from './PaymentModel';

let CustomerSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
    default: mongoose.Types.ObjectId
  },
  name: String,
  billing_address: {type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
  service_addresses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Person' }],
  payments: [PaymentModel.schema],
  active: Boolean
});

CustomerSchema.set('toJSON', {getters: true});

export default mongoose.model('Customer', CustomerSchema);