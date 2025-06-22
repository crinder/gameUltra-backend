const {conexion} = require('./database/conexion');
const express = require('express');
const cors = require('cors');
const cookieParser =  require('cookie-parser');

//const cron = require('./cron/Sendmail');

//conexion db

conexion();

const app = express();
const port = 3900;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

//convertir los datos del body en un objeto js
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
/*
app.use((req, res, next) => {
     res.header('Access-Control-Allow-Origin','http://localhost:5173'); // Reemplaza con el origen correcto
     res.header('Access-Control-Allow-Credentials', true);
     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
     next();
   });*/

const userRouter = require('./routes/user');
const categoryRouter = require('./routes/category');
const gameRouter = require('./routes/game');
const pedidoRouter = require('./routes/pedido');
const reviewRouter = require('./routes/review');
const sliderRouter = require('./routes/slider');
const shoppingRouter = require('./routes/temp_shopping'); 

app.use('/api/user',userRouter);
app.use('/api/category/',categoryRouter);
app.use('/api/game',gameRouter);
app.use('/api/pedido',pedidoRouter);
app.use('/api/review',reviewRouter);
app.use('/api/slider',sliderRouter);
app.use('/api/temp',shoppingRouter);

app.listen(port, () => {
    console.log("servidor corriendo en el puerto");
});