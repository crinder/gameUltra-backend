const {Schema, model} = require('mongoose');

const tempShoppingSchema = Schema({

    id_token:{
        type: String,
        required: true
    },

    id_game:{
        type: Schema.ObjectId,
        ref: 'Game'
    },

    created_at:{
        type: Date,
        default: Date.now()
    }

});

module.exports = model('TempShopping', tempShoppingSchema,'temp_shopping');