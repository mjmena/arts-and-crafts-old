import mongoose from 'mongoose';
import CustomerModel from './models/CustomerModel';
import AddressModel from './models/AddressModel';
import ServiceModel from './models/ServiceModel';
import PaymentModel from './models/PaymentModel';
import {
    Days
}
from '../utils/enums';

import data from './sample';

mongoose.connect('mongodb://localhost/test');

CustomerModel.remove({}).exec().then(() => {
    console.log('Customers Collection Sanitized');
    AddressModel.remove({}).exec().then(() => {
        console.log('Addresses Collection Sanitized');
        ServiceModel.remove({}).exec().then(() => {
            console.log('Services Collection Sanitized');
            PaymentModel.remove({}).exec().then(() => {
                console.log('Payments Collection Sanitized');
                parseData(data);
                CustomerModel.find({}).exec().then((customers) => {
                   console.log(customers);
                });
            });
        });
    });
});

function parseData(data){
    data.map((customer)=>{
        customer.service_addresses = customer.service_addresses.map((address)=>{
            address.services = address.services.map((service)=> {
                service = new ServiceModel(service);
                service.save();
                return service;
            });
            
            address = new AddressModel(address);
            address.save();
            return address;
        });
        
        customer.payments = customer.payments.map((payment) => {
            payment = new PaymentModel(payment);
            payment.save();
            return payment; 
        });
        
        customer.billing_address = new AddressModel(customer.billing_address);
        customer.billing_address.save();
        customer.billing_day = Math.floor((Math.random() * 7));
        customer = new CustomerModel(customer);
        customer.save();
        return customer;
    });
}
