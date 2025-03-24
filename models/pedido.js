const {Schema, model} = require('mongoose');

const pedidoSchema = Schema({

    id_user:{
        type: Schema.ObjectId,
        ref: 'Users'
    },

    created_at:{
        type: Date,
        default: Date.now()
    },

    status:{
        type: String,
        default: 'ACT'
    },

    method:{
        type: String,
        default: 'us'
    },

    total_local:{
        type: Number,
        default: 0
    },

    game:{
        type: Object,
        default: {}
    },

    total_money:{
        type: Number,
        default: 0
    }

});

module.exports = model('Pedido', pedidoSchema,'pedido');