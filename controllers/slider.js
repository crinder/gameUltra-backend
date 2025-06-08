const Slider = require('../models/slider');
const fs = require("fs");
const path = require('path');


const upload = async (req, res) => {

    const params = req.body;
    const files = req.files;
    let ids = [];
    let element;
    let position = 0;


    if (files == undefined || !files) {
        return res.status(400).send({
            status: "error",
            message: "Faltan parametros"
        });
    }

    if (Array.isArray(params.id)) {

        params.id.forEach((element, index) => {
            ids.push({ id: element, index: index });
            position++;
        });
    } else {
        ids.push({ id: params.id, index: 0 });
    }


    files.map((file, index) => {

        let image = file.filename;


        if (ids.length > 0) {
            element = ids[index].id;
            params.id = element;
            params.position = ids[index].index;
        }

        let imageSplit = image.split("\.");
        let ext = imageSplit[1];


        if (ext != 'png' && ext != "jpeg" && ext != 'gif' && ext != 'jpg' && ext != 'webp') {

            // se borrar la extension del archivo
            const filePath = req.file.path;
            const fileDelete = fs.unlinkSync(filePath);
        }


        params.image = image;
        params.created_at = Date.now();

        const sliderSaved = new Slider(params);

        sliderSaved.save();
    });

    return res.status(200).send({
        status: "success",
        message: "registro guardado"
    });
}

const list = async (req, res) => {

    const params = req.body;
    let body = {};

    body.tipo = params.tipo;


    if(!params.tipo){
        body.tipo = 'S';
    }

    Slider.find(body).sort('position')
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

const images = async (req, res) => {
    const nomImg = req.params.img;


    const filePath = "./uploads/slider/" + nomImg;

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

const updatePosition = async (req,res) =>{

    const positions = req.body.position;
    const ids  = req.body.del;
    const tipoS = req.body.tipo;

    if(ids){
        await  ids.forEach( async id => {

           const image = await Slider.findOne({id: id}).select('image');

           const fileDelete = fs.unlinkSync("./uploads/slider/" + image.image);

            await Slider.findOneAndDelete({id: id});
        });
    }

    if(positions){

      await  positions.forEach( async pos => {

          await Slider.findOneAndUpdate({id: pos.id}, {$set: {...pos, tipo: tipoS}}, {new: true});

        });
    }

    return res.status(200).send({
        status: 'success',
        message: 'posiciones actualizadas'
    });

}

module.exports = {
    upload,
    list,
    deleteSlider,
    images,
    updatePosition
}