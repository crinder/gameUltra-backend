const Category = require('../models/category');
const fs = require("fs");
const path = require('path');

const prueba = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "prueba category gameGalaxy"
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

        params.img = image;


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
                            message: "Error guardando categoría",
                            error: error.message
                        });
                    });
            });
    } else {

        let idCategory = params.id;

        if (file) {
            //conseguir el nombre del archivo

            let image = file.filename;

            console.log('image...', image);

            //sacar la extensión del archivo

            let imageSplit = image.split("\.");
            let ext = imageSplit[1];

            if (ext != 'png' && ext != "jpeg" && ext != 'gif' && ext != 'jpg') {

                // se borrar la extension del archivo
                const filePath = req.file.path;
                const fileDelete = fs.unlinkSync(filePath);
            }

            params.img = image;
        }

        Category.find({ name: { $regex: new RegExp(params.name, 'i') } })
            .then(async category => {


                if (category && category.length >= 1) {
                    return res.status(500).send({
                        status: "error",
                        message: "Error ya existe la categoría"
                    });
                }

                console.log('params...', params);


                await Category.findByIdAndUpdate({ _id: idCategory }, params, { new: true })
                    .then(category => {
                        return res.status(200).send({
                            status: "success",
                            message: "registro actualizado",
                            category: category
                        });
                    }).catch(error => {
                        return res.status(500).send({
                            status: "error",
                            message: "Error guardando categoría",
                            error: error.message
                        });
                    });
            });

    }

}

const images = async (req, res) => {
    
    const nomImg = req.params.img;
    const filePath = "./uploads/category/" + nomImg;

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

    Category.findById(id)
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

module.exports = {
    prueba,
    list,
    deleteCategory,
    update,
    upload,
    images,
    listOne
}