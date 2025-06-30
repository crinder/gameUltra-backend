const User = require('../models/users');
const HistoryConex = require('../models/HistoryConex');
const bcrypt = require('bcrypt');
const jwt = require('../service/jwt');
const moment = require('moment');
const result = require('dotenv').config();

const prueba = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "prueba user gameGalaxy"
    });
}

const checkToken = (data) => {

    const timeDate = Date.now() / 1000;

    return (
        data.iss == 'https://accounts.google.com' &&
        data.aud == process.env.CLIENT_ID_GOOGLE &&
        data.exp > timeDate
    );
};

const register = async (data) => {

    const user = new User(data);

    const userSave = await user.save();
};


const checkUser = async (data) => {

    const user = await User.findOne({ sub: data.sub });

    if (user) {
        let userBack = {
            id_user: user._id,
            sub: user.sub,
            name: user.name,
            email: user.email,
            picture: user.picture,
            lastLogin: user.lastLogin,
            isAnonymous: user.isAnonymous,
            created_at: user.created_at,
            token: user.token
        }

        console.log('user...', userBack);

        const history = new HistoryConex(userBack);
        await history.save();
        await User.findOneAndUpdate({ sub: data.sub }, user, { $set: { lastLogin: Date.now() } });

        console.log('actuliza user...', user);

    } else {
        console.log('regisro...', data);
        await register(data);
        console.log('registro...', data);
    }

};

const authGoogle = async (req, res) => {
    const params = req.body;

    if (!params.token) {
        return res.status(400).send({
            status: "error",
            message: "Faltan parametros"
        });
    }

    try {
        const base64Url = params.token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));


        let data = JSON.parse(jsonPayload);

        if (checkToken(data)) {
            await checkUser(data);

            const userSa = await User.findOne({ sub: data.sub.toString() });

            if (userSa) {

                const tokenRefresh = jwt.createtokenRefresh(userSa);

                res.cookie('token_refresh', tokenRefresh, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'Lax',
                    maxAge: 3600000
                });

                res.status(200).send({
                    status: "success",
                    user: data,
                    token: tokenRefresh
                });
            } else {
                return res.status(400).send({
                    status: "error",
                    message: "Error al autenticar"
                });
            }
        }

    } catch (e) {
        console.error("Error al decodificar el JWT:", e);
        return null;
    }

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

    if (!params.nickname || !params.password) {

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

const refresh = (req, res) => {

    const user = req.user;
    const tokenNew = req.tokenNew;

    if (!user) {
        return res.status(400).json({
            status: 'error',
            message: 'error no existe token',
            token: null
        });
    }

    if (tokenNew) {
        return res.status(200).json({
            status: 'success',
            token: tokenNew,
            message: 'token anterior'
        });
    }

    const newToken = jwt.createToken(user);

    return res.status(200).json({
        status: 'success',
        token: newToken,
        id_user: user.id,
        image: user.img
    })
}

const logout = (req, res) => {

    res.clearCookie("token_refresh", {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        path: '/'
    });
    return res.status(200).json({
        status: 'success',
        message: 'usuario desconectado'
    });
}

module.exports = {
    prueba,
    register,
    profile,
    login,
    authGoogle,
    refresh,
    logout
}