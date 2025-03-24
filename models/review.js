const {Schema, model} = require('mongoose');

const reviewSchema = Schema({

    id_user:{
        type: Schema.ObjectId,
        ref: 'Users'
    },

    id_game:{
        type: Schema.ObjectId,
        ref: 'Game'
    },

    calificacion:{
        type: Number,
        default: 0
    },

    comentario:{
        type: String,
        default: ''
    },

    created_at:{
        type: Date,
        default: Date.now()
    }

});

module.exports = model('Review', reviewSchema,'review');