const Review = require('../models/review');
const Game = require('../models/game');
const moment = require('moment');
const jwt = require('../service/jwt');
const ObjectId = require('mongodb').ObjectId;

const prueba = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "prueba review gameGalaxy"
    });
}

const register = async (req, res) => {
    const params = req.body;

    if (!params.id_game || !params.calificacion || !params.comentario) {
        return res.status(400).send({
            status: "error",
            message: "Faltan parametros"
        });
    }

    let game = await Game.findById(new ObjectId(params.id_game));

    if (!game) {
        return res.status(400).send({
            status: "error",
            message: "Error no existe el juego"
        });
    }

    params.created_at = moment().unix();

    const reviewSaved = new Review(params);

    reviewSaved.save()
        .then(review => {
            return res.status(200).send({
                status: "success",
                message: "registro guardado",
                review: review
            });
        }).catch(error => {
            return res.status(500).send({
                status: "error",
                message: "Error guardando reseña",
                error: error.message

            });
        });
 
}

const listOne = async (req, res) => {

    Review.find({id_game: req.params.id })
        .then(review => {
            return res.status(200).send({
                status: "success",
                message: "listado completado",
                review: review
            });
        }).catch(error => {
            return res.status(400).send({
                status: "error",
                message: "Error buscando reseña",
                error: error.message
            });
        });
}

const deleteReview = (req, res) => {
    const id = req.params.id;

    Review.findByIdAndDelete({ _id: id })
        .then(reviewDelete => {
            return res.status(200).send({
                status: "success",
                message: "Reseña eliminado"
            });
        }).catch(error => {
            return res.status(400).send({
                status: "error",
                message: "Error eliminando reseña"
            });
        });
}

const update = (req, res) => {

    const id = req.params.id;
    const params = req.body;

    Review.findByIdAndUpdate({ _id: id }, params, { new: true })
        .then(reviewUpdate => {
            return res.status(200).send({
                status: "success",
                message: "registro actualizado",
                review: reviewUpdate
            });
        }).catch(error => {
            return res.status(400).send({
                status: "error",
                message: "Error actualizando usuario",
                error: error.message
            });
        });
}


module.exports = {
    prueba,
    register,
    listOne,
    deleteReview,
    update
} 