import {
    GraphQLBoolean,
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
    connectionFromArray,
    connectionFromPromisedArray,
    fromGlobalId,
    globalIdField
}
from 'graphql-relay';

import CustomerModel from './models/CustomerModel';
import AddressModel from './models/AddressModel';
import ServiceModel from './models/ServiceModel';
import PaymentModel from './models/PaymentModel';

let PaymentType = new GraphQLObjectType({
    name: 'Payment',
    fields: {
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
    }
})
let ServiceType = new GraphQLObjectType({
    name: 'Service',
    fields: {
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
    }
})

let AddressType = new GraphQLObjectType({
    name: 'Address',
    fields: {
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
            type: new GraphQLList(ServiceType)
        }
    }
})

const {
  connectionType: AddressConnection,
  edgeType: AddressEdge,
} = connectionDefinitions({name: 'Address', nodeType: AddressType});


let CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: {
        id: globalIdField('Customer'),
        name: {
            type: GraphQLString
        },
        billing_address: {
            type: AddressType,
            resolve: (parent) => {
                return AddressModel.findOne({
                    _id: parent.billing_address
                });
            }
        },
        service_addresses: {
            type: AddressConnection,
            args: connectionArgs,
            resolve: (customer, args) => {
                let query = AddressModel.find({
                    _id: {
                        $in: customer.service_addresses
                    }
                }).sort({city:1});
                
                return connectionFromPromisedArray(query,args)
            }
        },
        payments: {
            type: new GraphQLList(PaymentType)
        },
        active: {
            type: GraphQLBoolean
        }
    }
});

let schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            customers: {
                type: new GraphQLList(CustomerType),
                resolve: () => {
                    return CustomerModel.find({});
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
                        id: fromGlobalId(id).id
                    });
                }
            },
        }
    })
});

export default schema;