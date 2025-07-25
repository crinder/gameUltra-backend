const {Schema, model} = require('mongoose');

const usersSchema = Schema({

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

    isAnonymous:{
        type: Boolean,
        default: false
    },
    
    created_at:{
        type: Date,
        default: Date.now()
    },

    token:{
        type: String,
        default: 'token'
    }

});

module.exports = model('Users', usersSchema,'users');