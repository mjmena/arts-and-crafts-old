import mongoose from 'mongoose';
import ServiceModel from './ServiceModel';
import {Days} from '../../utils/enums'

let AddressSchema = new mongoose.Schema({
  description: String,
  day: {
    type: String,
    enums: Object.keys(Days)
  },
  street: String,
  city: String,
  state: String,
  zip: String,
  services: [{type: mongoose.Schema.Types.ObjectId, ref: 'Service' }]
});

AddressSchema.set('toJSON', {getters: true});

export default mongoose.model('Address', AddressSchema);