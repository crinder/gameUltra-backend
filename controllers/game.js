const Game = require('../models/game');
const Category = require('../models/category');
const User = require('../models/users');
const moment = require('moment');
const jwt = require('../service/jwt');

const prueba = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "prueba game gameGalaxy"
    });
}

const register = async (req, res) => {
    const params = req.body;

    if (!params.name || !params.category || !params.price || !params.description) {
        return res.status(400).send({
            status: "error",
            message: "Faltan parametros"
        });
    }

    let category = await Category.findById(params.category);

    if (!category) {
        return res.status(400).send({
            status: "error",
            message: "Error no existe la categoría"
        });
    }


    params.created_at = moment().unix();

    Game.find({ name: { $regex: new RegExp(params.name, 'i') } })
        .then(async game => {
            if (game && game.length >= 1) {
                return res.status(500).send({
                    status: "error",
                    message: "Error ya existe el juego"
                });
            }

            const gameSaved = new Game(params);

            gameSaved.save()
                .then(game => {
                    return res.status(200).send({
                        status: "success",
                        message: "registro guardado",
                        game: game
                    });
                }).catch(error => {
                    return res.status(500).send({
                        status: "error",
                        message: "Error guardando juego"
                    });
                });
        });
}

const list = async (req, res) => {

    Game.find()
        .then(game => {
            return res.status(200).send({
                status: "success",
                message: "listado completado",
                game: game
            });
        }).catch(error => {
            return res.status(400).send({
                status: "error",
                message: "Error buscando juego",
                error: error.message
            });
        });
}

const deleteGame = (req, res) => {
    const id = req.params.id;

    Game.findByIdAndDelete({ _id: id })
        .then(gameDelete => {
            return res.status(200).send({
                status: "success",
                message: "Juego eliminado"
            });
        }).catch(error => {
            return res.status(400).send({
                status: "error",
                message: "Error eliminando juego"
            });
        });
}

const update = (req, res) => {

    const id = req.params.id;
    const params = req.body;

    Game.findByIdAndUpdate({ _id: id }, params, { new: true })
        .then(gameUpdate => {
            return res.status(200).send({
                status: "success",
                message: "registro actualizado",
                game: gameUpdate
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
    list,
    deleteGame,
    update
}   