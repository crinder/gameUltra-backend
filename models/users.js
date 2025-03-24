const {Schema, model} = require('mongoose');

const usersSchema = Schema({

    nickname:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true
    },

    password:{
        type: String,
        required: true
    },

    role:{
        type: String,
        default: 'user'
    },

    status:{
        type: String,
        default: 'ACT'
    },

    avatar:{
        type: String,
        default: 'avatar.png'
    },

    created_at:{
        type: Date,
        default: Date.now()
    },

});

module.exports = model('Users', usersSchema,'users');