const {Schema, model} = require('mongoose');

const categorySchema = Schema({

    name:{
        type: String,
        required: true
    },

    id_user:{
        type: Schema.ObjectId,
        ref: 'Users'
    },

    status:{
        type: String,
        default: 'ACT'
    },
    created_at:{
        type: Date,
        default: Date.now()
    }

});

module.exports = model('Category', categorySchema,'category');