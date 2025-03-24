const users = require('../models/users');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('../service/jwt');
const moment = require('moment');


const prueba = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "prueba user gameGalaxy"
    });
}

const register = async (req, res) => {
    const params = req.body;


    if (!params.nickname || !params.email || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "Faltan parametros"
        });
    }

    User.find({
        $or: [
            { email: params.email.toLowerCase() },
            { nickname: params.nickname.toLowerCase() }
        ]
    }).then(async users => {
        if (users && users.length >= 1) {
            return res.status(500).send({
                status: "error",
                message: "Error ya existe el usuario"
            });
        }

        const salt = await bcrypt.genSalt(10);
        params.password = await bcrypt.hash(params.password, salt);

        const userSaved = new User(params);

        userSaved.save()
            .then(user => {
                return res.status(200).send({
                    status: "success",
                    message: "registro guardado",
                    user: user
                });
            }).catch(error => {
                return res.status(500).send({
                    status: "error",
                    message: "Error guardando usuario"
                });
            });
    });
}

const profile = async (req, res) => {

    const id = req.params.id;

    User.findById(id)
        .select({ password: 0, role: 0 })
        .then(userProfile => {
            if (!userProfile) {
                return res.status(404).send({
                    status: "error",
                    message: "Error usuario no existe"
                });
            }
            return res.status(200).send({
                status: "success",
                user: userProfile
            });
        }).catch(error => {
            return res.status(400).send({
                status: "error",
                message: "Error buscando usuario"
            });
        });

}


const deleteUser = (req, res) => {
    const id = req.params.id;

    User.findByIdAndDelete({ _id: id })
        .then(userDelete => {
            return res.status(200).send({
                status: "success",
                message: "Usuario eliminado"
            });
        }).catch(error => {
            return res.status(400).send({
                status: "error",
                message: "Error eliminando usuario"
            });
        });
}

const login = async (req, res) => {

    let params = req.body;

    if (!params.nickname  || !params.password) {

        return res.status(400).send({
            status: 400,
            message: "Datos incompletos"
        });
    }

    await User.findOne({ nickname: params.nickname })
        .then(userStored => {

            if (!userStored) {

                return res.status(404).send({
                    status: 404,
                    message: "Error el usuario no exista"
                });

            }

            let pwd = bcrypt.compareSync(params.password, userStored.password);

            if (!pwd) {
                return res.status(400).send({
                    status: 400,
                    message: "Error contraseña invalida"
                });
            }

            const tokenRefresh = jwt.createtokenRefresh(userStored);


            res.cookie('token_refresh', tokenRefresh,{
                httpOnly: true,
                secure: false,
                SameSite: 'Lax',
                maxAge: 3600000 
            });

            res.status(200).send({
                status: "success",
                user: {
                    id: userStored._id,
                    name: userStored.name
                }
            });
        }).catch(error => {
            return res.status(400).send({
                status: 400,
                message: "Error buscando usuario",
                error: error.message
            });

        });
}

module.exports = {
    prueba,
    register,
    profile,
    login
}