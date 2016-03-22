import {
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLFloat,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString
}
from 'graphql';

import {
    connectionArgs,
    connectionDefinitions,
    connectionFromPromisedArray,
    fromGlobalId,
    globalIdField,
    nodeDefinitions
}
from 'graphql-relay';

import CustomerModel from './models/CustomerModel';
import AddressModel from './models/AddressModel';
import ServiceModel from './models/ServiceModel';
import PaymentModel from './models/PaymentModel';

import * as Enums from '../utils/enums';

const {
    nodeInterface, nodeField
} = nodeDefinitions(
    (globalId) => {
        var {
            type, id
        } = fromGlobalId(globalId);
        if (type === 'Customer') {
            return CustomerModel.findOne({
                _id: id
            });
        }
        else if (type === 'Address') {
            return AddressModel.findOne({
                _id: id
            });
        }
        else if (type === 'Service') {
            return ServiceModel.findOne({
                _id: id
            });
        }
        else if (type === 'Payment') {
            return PaymentModel.findOne({
                _id: id
            });
        }
        else {
            return null;
        }
    }, (obj) => {
        if (obj instanceof CustomerModel) {
            return CustomerType;
        }
        else if (obj instanceof AddressModel) {
            return AddressType;
        }
        else if (obj instanceof ServiceModel) {
            return ServiceType;
        }
        else if (obj instanceof PaymentModel) {
            return PaymentType;
        }
        else {
            return null;
        }
    }
);

const PaymentType = new GraphQLObjectType({
    name: 'Payment',
    fields: {
        id: globalIdField('Payment', payment => payment._id),
        type: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        amount: {
            type: GraphQLFloat
        },
        date: {
            type: GraphQLString,
            resolve: (parent) => {
                return parent.date.toString();
            }
        }
    },
    interfaces: [nodeInterface],
})

const {
    connectionType: PaymentConnection,
    edgeType: PaymentEdge
} = connectionDefinitions({
    name: 'Payment',
    nodeType: PaymentType
});

let ServiceType = new GraphQLObjectType({
    name: 'Service',
    fields: {
        id: globalIdField('Service', service => service._id),
        description: {
            type: GraphQLString
        },
        cost: {
            type: GraphQLFloat
        },
        date: {
            type: GraphQLString,
            resolve: (parent) => {
                return parent.date.toString();
            }
        }
    },
    interfaces: [nodeInterface],
})

const {
    connectionType: ServiceConnection,
    edgeType: ServiceEdge
} = connectionDefinitions({
    name: 'Service',
    nodeType: ServiceType
});

var DayEnum = new GraphQLEnumType({
    name: 'Day',
    description: 'A Day of the Week',
    values: Enums.Days
});

const AddressType = new GraphQLObjectType({
    name: 'Address',
    fields: {
        id: globalIdField('Address', address => address._id),
        description: {
            type: GraphQLString
        },
        day: {
            type: GraphQLString,
            resolve: (address) => {
                return Enums.ValueToDescription(Enums.Days, address.day);
            }
        },
        street: {
            type: GraphQLString
        },
        city: {
            type: GraphQLString
        },
        state: {
            type: GraphQLString
        },
        zip: {
            type: GraphQLString
        },
        services: {
            type: ServiceConnection,
            args: connectionArgs,
            resolve: (address, args) => {
                let query = ServiceModel.find({
                    _id: {
                        $in: address.services
                    }
                }).sort({
                    date: 1
                });

                return connectionFromPromisedArray(query, args)
            }
        }
    },
    interfaces: [nodeInterface],
})

const {
    connectionType: AddressConnection,
    edgeType: AddressEdge,
} = connectionDefinitions({
    name: 'Address',
    nodeType: AddressType
});


const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: {
        id: globalIdField('Customer', customer => customer._id),
        name: {
            type: GraphQLString
        },
        billing_address: {
            type: AddressType
        },
        service_addresses: {
            type: AddressConnection,
            args: connectionArgs,
            resolve: (customer, args) => {
                let query = AddressModel.find({
                    _id: {
                        $in: customer.service_addresses
                    }
                }).sort({
                    day: 1
                });

                return connectionFromPromisedArray(query, args)
            }
        },
        payments: {
            type: PaymentConnection,
            args: connectionArgs,
            resolve: (customer, args) => {
                let query = PaymentModel.find({
                    _id: {
                        $in: customer.payments
                    }
                }).sort({
                    date: -1
                });

                return connectionFromPromisedArray(query, args)
            }
        },
        active: {
            type: GraphQLBoolean
        }
    },
    interfaces: [nodeInterface],
});

let schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            node: nodeField,
            customers: {
                type: new GraphQLList(CustomerType),
                args: {
                    day: {
                        type: DayEnum
                    }
                },
                resolve: (root, {
                    day
                }) => {
                    if (day != undefined) {
                        return CustomerModel.find({
                            'billing_address.day': day
                        });
                    }
                    else {
                        return CustomerModel.find({});
                    }
                }
            },
            customer: {
                type: CustomerType,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLID)
                    }
                },
                resolve: (parent, {
                    id
                }) => {
                    return CustomerModel.findOne({
                        _id: fromGlobalId(id).id
                    });
                }
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            addCustomer: {
                type: CustomerType,
                args: {
                    name: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: (obj, {
                    name
                }) => {
                    console.log(name);
                    const new_customer = new CustomerModel({
                        name: name,
                        active: true
                    });
                    new_customer.save((err) => {
                        if(err){
                            console.log(err)
                        }
                    })
                                            
                    return new_customer;
                }
            },
            updateBillingAddress: {
                type: AddressType,
                args: {
                    customer_id: {
                        type: new GraphQLNonNull(GraphQLID)
                    },
                    description: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    day: {
                        type: new GraphQLNonNull(DayEnum),
                    },
                    street: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    city: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    state: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    zip: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                },
                resolve: (obj, {
                    customer_id, description, day, street, city, state, zip
                }) => {
                    const new_address = new AddressModel({
                            description: description,
                            day:day,
                            street: street,
                            city: city,
                            state: state,
                            zip: zip
                    });
                    new_address.save((err) => {
                        console.log(err)  
                    })
                        
                    CustomerModel.findByIdAndUpdate(
                        fromGlobalId(customer_id).id,
                        {billing_address: new_address},
                        {safe: true, new : true},
                        function(err, model) {
                            //console.log(err);
                        }
                    );
                    
                    return new_address;
                }
            },
            addServiceAddress: {
                type: AddressType,
                args: {
                    customer_id: {
                        type: new GraphQLNonNull(GraphQLID)
                    },
                    description: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    day: {
                        type: new GraphQLNonNull(DayEnum),
                    },
                    street: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    city: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    state: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    zip: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                },
                resolve: (obj, {
                    customer_id, description, day, street, city, state, zip
                }) => {
                    const new_address = new AddressModel({
                            description: description,
                            day:day,
                            street: street,
                            city: city,
                            state: state,
                            zip: zip
                    });
                    new_address.save((err) => {
                        if(err) {
                            console.log(err);
                        }else{
                            console.log("New Service Address added to Addresses Collection sucessfully")
                        }
                    });
                        
                    CustomerModel.findByIdAndUpdate(
                        fromGlobalId(customer_id).id,
                        {$push: {service_addresses: new_address}},
                        {safe: true, new : true},
                        function(err, model) {
                            if(err) {
                                console.log(err);
                            }else{
                                console.log("New Service Address reference added to Customer " + model.name + " sucessfully");
                            }
                        }
                    );
                    
                    return new_address;
                }
            }
        }
    })
});

export default schema;