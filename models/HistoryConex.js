const { Schema, model } = require('mongoose');

const HistorySchema = new Schema({
    sub:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true
    },

    name:{
        type: String,
        required: true
    },

    picture:{
        type: String,
        default: 'image.png'
    },

    lastLogin:{
        type: Date,
        default: Date.now()
    },
    
    created_at:{
        type: Date,
        default: Date.now()
    },

    token:{
        type: String,
        default: 'token'
    },

    id_user:{
        type: Schema.ObjectId,
        ref: 'Users'
    }
        
}); 

module.exports = model('HistoryConex', HistorySchema, 'HistoryConex');