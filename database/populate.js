import mongoose from 'mongoose';
import CustomerModel from './models/CustomerModel';
import AddressModel from './models/AddressModel';
import ServiceModel from './models/ServiceModel';
import PaymentModel from './models/PaymentModel';

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

let cash_payment = new PaymentModel({
    type: 'Cash',
    description: 'Given to Martin at house',
    amount: 10,
    date: Date.now()
})

let check_payment = new PaymentModel({
    type: 'Check',
    description: 'Check#',
    amount: 20,
    date: Date.now()
})

let service = new ServiceModel({
    description: 'Cut and Trim',
    cost: 35.00,
    date: Date.now()
})

let address = new AddressModel({
    street: '2152 Prospect Ave.',
    city: 'Croydon',
    state: 'PA',
    zip: '19021',
    services: [service]
});

let address2 = new AddressModel({
    street: '123 Street St.',
    city: 'Cityville',
    state: 'PA',
    zip: '00000',
    services: [service]
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