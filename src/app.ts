import {config} from 'dotenv';
config();
import express from 'express';

//Importo las rutas...
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';

const app=express();

//Agregando los Middlewares de la aplicación
app.use(express.json());

//Agregando las rutas

app.use('/auth',authRoutes);
app.use('/products',productRoutes);



export default app;
