const Slider = require('../models/slider');
const fs = require("fs");
const path = require('path');


const upload = async (req, res) => {

    const params = req.body;
    const files = req.files;
    let ids = [];
    let element;
    let position = 0;

    if (!params.ids) {
        if (files == undefined || !files) {
            return res.status(400).send({
                status: "error",
                message: "Faltan parametros"
            });
        }

        if (params.id.length > 1) {
            
            params.id.forEach((element, index) => {
                ids.push({ id: element, index: index });
                position++;
            });
        }else{
            ids.push({ id: params.id, index: 0 });
        }


        files.map((file, index) => {

            let image = file.filename;


            if(ids.length > 0) {
                element = ids[index].id;
                params.id = element;
                params.position = ids[index].index;
            }

            let imageSplit = image.split("\.");
            let ext = imageSplit[1];


            if (ext != 'png' && ext != "jpeg" && ext != 'gif' && ext != 'jpg') {

                // se borrar la extension del archivo
                const filePath = req.file.path;
                const fileDelete = fs.unlinkSync(filePath);
            }

            params.image = image;
            params.created_at = Date.now();

            const sliderSaved = new Slider(params);

            sliderSaved.save();
        });
    } else {

        let image = files.filename;

        //sacar la extensión del archivo

        let imageSplit = image.split("\.");
        let ext = imageSplit[1];

        if (ext != 'png' && ext != "jpeg" && ext != 'gif' && ext != 'jpg') {

            // se borrar la extension del archivo
            const filePath = req.file.path;
            const fileDelete = fs.unlinkSync(filePath);
        }


        params.image = image;

        Slider.findByIdAndUpdate({ _id: id }, params, { new: true })
            .then(slider => {
                return res.status(200).send({
                    status: "success",
                    message: "registro actualizado",
                    slider: slider
                });
            }).catch(error => {
                return res.status(500).send({
                    status: "error",
                    message: "Error guardando juego"
                });
            });

    }

    return res.status(200).send({
        status: "success",
        message: "registro guardado"
    });
}

const list = async (req, res) => {

    Slider.find()
        .then(slider => {
            return res.status(200).send({
                status: "success",
                message: "listado completado",
                slider: slider
            });
        }).catch(error => {
            return res.status(400).send({
                status: "error",
                message: "Error buscando juego",
                error: error.message
            });
        });
}

const deleteSlider = (req, res) => {
    const id = req.params.id;

    Slider.findByIdAndDelete({ _id: id })
        .then(sliderDelete => {
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

module.exports = {
    upload,
    list,
    deleteSlider
}