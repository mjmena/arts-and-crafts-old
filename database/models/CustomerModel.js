import mongoose from 'mongoose';
import AddressModel from './AddressModel';
import PaymentModel from './PaymentModel';
import {Days} from '../../utils/enums'


let CustomerSchema = new mongoose.Schema({
  name: String,
  billing_day: {
    type: Number,
  },
  billing_address: {type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
  service_addresses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
  payments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
  active: Boolean
});

CustomerSchema.set('toJSON', {getters: true});

export default mongoose.model('Customer', CustomerSchema);