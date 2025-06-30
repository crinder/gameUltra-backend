const {Schema, model} = require('mongoose');

const pedidoSchema = Schema({

    id_user:{
        type: Schema.ObjectId,
        ref: 'Users'
    },

    created_at:{
        type: String,
        default: Date.now()
    },

    status:{
        type: String,
        default: 'ACT'
    },

    method:{
        type: String,
        default: 'US'
    },

    total_neto:{
        type: Number,
        default: 0
    },

    game:[
        {
            id_game: {
                type: Schema.ObjectId,
                ref: 'Game'
            },
            name: {
                type: String,
                default: ''
            },
            price: {
                type: Number,
                default: 0
            },
            descuento: {
                type: Number,
                default: 0
            },
            image: {
                type: String,
                default: '' 
            }
        }
    ],
        
    descuento:{
        type: Number,
        default: 0
    },

    total:{
        type: Number,
        default: 0
    }


});

module.exports = model('Pedido', pedidoSchema,'pedido');