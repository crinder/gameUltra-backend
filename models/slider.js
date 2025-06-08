const { Schema, model } = require('mongoose');

const sliderSchema = Schema({

    image: {
        type: String,
        default: 'image.png'
    },


    description: {
        type: String,
        default: 'Descripcion'
    },

    id: {
        type: String,
        default: 'id'
    },

    position: {
        type: Number,
        default: 0
    },

    tipo:{
        type: String,
        default: 'S'
    },

    created_at: {
        type: Date,
        default: Date.now()
    }
});

module.exports = model('Slider', sliderSchema,'slider');