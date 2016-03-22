import mongoose from 'mongoose';
import CustomerModel from './models/CustomerModel';
import AddressModel from './models/AddressModel';
import ServiceModel from './models/ServiceModel';
import PaymentModel from './models/PaymentModel';
import {Days} from '../utils/enums';

mongoose.connect('mongodb://localhost/test');

CustomerModel.remove({}, function(err) { 
  if(err){
      console.log(err);
  }
  console.log('Customers Collection Sanitized'); 
});

AddressModel.remove({}, function(err) { 
  if(err){
      console.log(err);
  }
  console.log('Addresses Collection Sanitized'); 
});

ServiceModel.remove({}, function(err) { 
  if(err){
      console.log(err);
  }
  console.log('Services Collection Sanitized'); 
});

PaymentModel.remove({}, function(err) { 
  if(err){
      console.log(err);
  }
  console.log('Payments Collection Sanitized'); 
});

let cash_payment = new PaymentModel({
    type: 'Cash',
    description: 'Given to Martin at house',
    amount: 10,
    date: Date.now()
})
cash_payment.save();

let check_payment = new PaymentModel({
    type: 'Check',
    description: 'Check#',
    amount: 20,
    date: Date.now()
})
check_payment.save();

let service = new ServiceModel({
    description: 'Cut and Trim',
    cost: 35.00,
    date: Date.now()
})

let service2 = new ServiceModel({
    description: 'Cut and Trim',
    cost: 40.00,
    date: Date.now()
})

service.save();
service2.save();

let address = new AddressModel({
    description: 'House #1',
    day: Days.MONDAY.value,
    street: '2152 Prospect Ave.',
    city: 'Croydon',
    state: 'PA',
    zip: '19021',
    services: [service]
});

let address2 = new AddressModel({
    description: 'House #2',
    day: Days.TUESDAY.value,
    street: '123 Street St.',
    city: 'Cityville',
    state: 'PA',
    zip: '00000',
    services: [service2]
});

address.save();
address2.save();

let customer = new CustomerModel({
    name:'Martin Mena', 
    billing_address: address,
    service_addresses: [address, address2],
    payments: [cash_payment, check_payment],
    active: true
    
});
customer.save();

CustomerModel.find({}).then((customers) => {
    console.log(customers);
    mongoose.disconnect();
});