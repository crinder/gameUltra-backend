const Game = require('../models/game');
const Category = require('../models/category');
const User = require('../models/users');
const moment = require('moment');
const jwt = require('../service/jwt');
const fs = require("fs");
const path = require('path');
const ObjectId = require('mongodb').ObjectId;

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

    const { page = 1, limit = 12, category = [], price_from = 0, price_to = 0, descuento = 0 } = req.body;
    const offset = (page - 1) * limit;

    let query = {};

    if (category.length > 0) {
        query.category = { $in: category };
    }

    if (price_from > 0) {
        query.price = { $gte: price_from };
    }

    if (price_to > 0) {
        query.price = { $lte: price_to };
    }

    if (descuento > 0) {
        query.descuento = { $lte: descuento };
    }


    const total = await Game.countDocuments(query);

    Game.find(query)
        .skip(offset)
        .limit(parseInt(limit))
        .then(game => {
            return res.status(200).send({
                status: "success",
                message: "listado completado",
                game: game,
                total: Math.ceil(total / limit)
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

const update = async(req, res) => {

    const {descuento, destacado} = req.body;
    
    for (const key in descuento) {

        let parametro = {
            descuento: descuento[key]
        }

        await Game.findByIdAndUpdate({ _id: key }, parametro, { new: true });

    }

    for (const key in destacado) {

        let parametro = {
            destacado: destacado[key]
        }

        await Game.findByIdAndUpdate({ _id: key }, parametro, { new: true });

    }


    return res.status(200).send({
        status: "success",
        message: "registro actualizado"
    });
}

const upload = async (req, res) => {

    const params = req.body;
    const file = req.file;


    if (!params.id) {

        if (!file) {
            return res.status(404).send({
                status: "error",
                message: "No incluye imagen"
            });
        }

        //conseguir el nombre del archivo

        let image = file.filename;

        //sacar la extensión del archivo

        let imageSplit = image.split("\.");
        let ext = imageSplit[1];

        if (ext != 'png' && ext != "jpeg" && ext != 'gif' && ext != 'jpg') {

            // se borrar la extension del archivo
            const filePath = req.file.path;
            const fileDelete = fs.unlinkSync(filePath);
        }

        params.image = image;


        Game.find({ name: { $regex: new RegExp(params.name, 'i') } })
            .then(async games => {

                games.forEach(game => {

                    if (game.name === params.name && game._id.toString() != params.id) {
                        return res.status(500).send({
                            status: "error",
                            message: "Error ya existe el juego"
                        });
                    }

                });

                params.category = params.category.split(',');
                params.plataforma = params.plataforma.split(',');
                params.idioma = params.idioma.split(',');

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
                            message: "Error guardando juego",
                            error: error.message
                        });
                    });
            });
    } else {

        let idCategory = params.id;

        if (file) {
            //conseguir el nombre del archivo

            let image = file.filename;
            //sacar la extensión del archivo

            let imageSplit = image.split("\.");
            let ext = imageSplit[1];

            if (ext != 'png' && ext != "jpeg" && ext != 'gif' && ext != 'jpg') {

                // se borrar la extension del archivo
                const filePath = req.file.path;
                const fileDelete = fs.unlinkSync(filePath);
            }

            params.image = image;
        }



        Game.find({ name: { $regex: new RegExp(params.name, 'i') } })
            .then(async games => {

                if (games.length > 0) {

                    games.forEach(game => {

                        if (game.name === params.name && game._id.toString() != params.id) {
                            return res.status(500).send({
                                status: "error",
                                message: "Error ya existe el juego"
                            });
                        }

                    });

                }

                params.category = params.category.split(',');
                params.plataforma = params.plataforma.split(',');
                params.idioma = params.idioma.split(',');

                await Game.findByIdAndUpdate({ _id: idCategory }, params, { new: true })
                    .then(game => {
                        return res.status(200).send({
                            status: "success",
                            message: "registro actualizado",
                            game: game
                        });
                    }).catch(error => {
                        return res.status(500).send({
                            status: "error",
                            message: "Error guardando juego",
                            error: error.message
                        });
                    });
            });

    }

}

const images = async (req, res) => {
    const nomImg = req.params.img;


    const filePath = "./uploads/game/" + nomImg;

    fs.stat(filePath, (error, exists) => {

        if (!exists) {
            return res.status(404).send({
                status: "success",
                message: "No existe imagen"
            });
        }

        return res.sendFile(path.resolve(filePath));

    });

}

const listOne = async (req, res) => {

    const id = req.params.id;

    Game.findById(id)
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

module.exports = {
    prueba,
    register,
    list,
    deleteGame,
    update,
    upload,
    images,
    listOne
}   