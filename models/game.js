const {Schema, model} = require('mongoose');

const gameSchema = Schema({

    name:{
        type: String,
        required: true
    },

    category:[
        {
            type: Schema.ObjectId,
            ref: 'Category'
        }
    ],
    
    price:{
        type: Number,
        required: true
    },

    description:{
        type: String,
        required: true
    },

    status:{
        type: String,
        default: 'ACT'
    },

    plataforma:[
        {
            type: String,
            default: 'pc'
        }
    ],

    image:{
        type: String,
        default: 'image.png'
    },

    descuento:{
        type: Number,
        default: 0
    },

    idioma:[
        {
            type: String,
            default: 'ES'
        }
    ],

    peso:{
        type: Number,
        default: 50
    },

    destacado:{
        type: String,
        default: 'N'
    },

    created_at:{
        type: Date,
        default: Date.now()
    }

});

module.exports = model('Game', gameSchema,'game');