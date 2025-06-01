const tempShopping = require('../models/temp_shopping');
const jwtShopping = require('../service/shopping');


const prueba = async (req, res) => {
   
    return res.status(200).json({
        status: 'success',
        message: 'temporal shopping'
        
    });
}

const returnToken = async (req, res) => {

    const token = await jwtShopping.createToken();

    return res.status(200).json({
        status: 'success',
        message: 'temporal shopping',
        token: token
    });
}

module.exports = {
    prueba,
    returnToken
}