const Pedido = require('../models/pedido');
const Game = require('../models/game');
const Category = require('../models/category');
const User = require('../models/users');
const moment = require('moment');
const jwt = require('../service/jwt');

const prueba = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "prueba pedido gameGalaxy"
    });
}

const register = async (req, res) => {
    const params = req.body;

    if (!params.id_game) {
        return res.status(400).send({
            status: "error",
            message: "Faltan parametros"
        });
    }

    let game = await Game.findById(params.id_game);

    if (!game) {
        return res.status(400).send({
            status: "error",
            message: "Error no existe el juego"
        });
    }

    params.created_at = moment().unix();

    Pedido.find({id_game: params.id_game })
        .then(async pedido => {
            if (pedido && pedido.length >= 1) {
                return res.status(500).send({
                    status: "error",
                    message: "Error ya existe el pedido"
                });
            }

            const pedidoSaved = new Pedido(params);

            pedidoSaved.save()
                .then(pedido => {
                    return res.status(200).send({
                        status: "success",
                        message: "registro guardado",
                        pedido: pedido
                    });
                }).catch(error => {
                    return res.status(500).send({
                        status: "error",
                        message: "Error guardando pedido",
                        error: error.message

                    });
                });
        });
}

const list = async (req, res) => {

    Pedido.find()
        .then(pedido => {
            return res.status(200).send({
                status: "success",
                message: "listado completado",
                pedido: pedido
            });
        }).catch(error => {
            return res.status(400).send({
                status: "error",
                message: "Error buscando pedido",
                error: error.message
            });
        });
}

const deletePedido = (req, res) => {
    const id = req.params.id;

    Pedido.findByIdAndDelete({ _id: id })
        .then(pedidoDelete => {
            return res.status(200).send({
                status: "success",
                message: "Pedido eliminado"
            });
        }).catch(error => {
            return res.status(400).send({
                status: "error",
                message: "Error eliminando pedido"
            });
        });
}

const update = (req, res) => {

    const id = req.params.id;
    const params = req.body;

    Pedido.findByIdAndUpdate({ _id: id }, params, { new: true })
        .then(pedidoUpdate => {
            return res.status(200).send({
                status: "success",
                message: "registro actualizado",
                pedido: pedidoUpdate
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
    deletePedido,
    update
}