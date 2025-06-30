const Pedido = require('../models/pedido');
const Game = require('../models/game');
const Category = require('../models/category');
const User = require('../models/users');
const moment = require('moment');
const jwt = require('../service/jwt');

const opcion = { year: 'numeric', month: '2-digit', day: '2-digit' };
const hoy = new Date();

const prueba = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "prueba pedido gameGalaxy"
    });
}

const register = async (req, res) => {

    const params = req.body;
    const games = params.game;

    let totalGames = 0;
    let descuento = 0
    let total = 0;
    let gamesNew = [];

    if (!games) {

        return res.status(400).send({
            status: "error",
            message: "Faltan parametros"
        });
    }

    params.id_user = req.user.id;

    const totales = games.map(async game => {

        let juegos = [];

        totalGames += game.value.price;
        descuento += game.value.price * game.value.descuento / 100;
        total += game.value.price - game.value.price * game.value.descuento / 100;

        juegos = {
            id_game: game.id,
            name: game.value.name,
            price: game.value.price,
            descuento: game.value.descuento,
            image: game.value.image
        }
        gamesNew.push(juegos);

    });

    params.total = total;
    params.descuento = descuento;
    params.total_neto = totalGames;
    params.game = gamesNew;
    const sysdate = hoy.toLocaleString('es-ES', opcion);
    params.created_at = moment(sysdate, 'DD/MM/YYYY HH:mm:ss').toDate();

    const gamesSave = new Pedido(params);

    gamesSave.save()
        .then(game => {
            return res.status(200).send({
                status: "success",
                message: "registro guardado",
                pedido: game
            });
        });

}

const list = async (req, res) => {

    const id_user = req.user.id;

    Pedido.find({ id_user: id_user })
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