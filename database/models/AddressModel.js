import mongoose from 'mongoose';
import ServiceModel from './ServiceModel';

let AddressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zip: String,
  services: [ServiceModel.schema]
});

AddressSchema.set('toJSON', {getters: true});

export default mongoose.model('Address', AddressSchema);