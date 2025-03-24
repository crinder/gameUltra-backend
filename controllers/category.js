const Category = require('../models/category');

const prueba = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "prueba category gameGalaxy"
    });
}

const register = async (req, res) => {
    const params = req.body;

    if (!params.name) {
        return res.status(400).send({
            status: "error",
            message: "Faltan parametros"
        });
    }

    console.log('params...', params.name.toLowerCase());

    Category.find({ name: { $regex: new RegExp(params.name, 'i') } })
        .then(async category => {
            
            if (category && category.length >= 1) {
                return res.status(500).send({
                    status: "error",
                    message: "Error ya existe la categoría"
                });
            }

            const categorySaved = new Category(params);

            categorySaved.save()
                .then(category => {
                    return res.status(200).send({
                        status: "success",
                        message: "registro guardado",
                        category: category
                    });
                }).catch(error => {
                    return res.status(500).send({
                        status: "error",
                        message: "Error guardando categoría"
                    });
                });
        });
}

const list = async (req, res) => {

    Category.find()
        .then(category => {
            return res.status(200).send({
                status: "success",
                message: "listado completado",
                category: category
            });
        }).catch(error => {
            return res.status(400).send({
                status: "error",
                message: "Error buscando categoría",
                error: error.message
            });
        });
}

const deleteCategory = (req, res) => {
    const id = req.params.id;

    Category.findByIdAndDelete({ _id: id })
        .then(categoryDelete => {
            return res.status(200).send({
                status: "success",
                message: "Categoría eliminado"
            });
        }).catch(error => {
            return res.status(400).send({
                status: "error",
                message: "Error eliminando categoría"
            });
        });
}

const update = (req, res) => {

    const id = req.params.id;
    const params = req.body;

    Category.findByIdAndUpdate({ _id: id }, params, { new: true })
        .then(categoryUpdate => {
            return res.status(200).send({
                status: "success",
                message: "registro actualizado",
                category: categoryUpdate
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
    deleteCategory,
    update
}