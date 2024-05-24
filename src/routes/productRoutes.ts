import express, { NextFunction, Request, Response } from 'express';
const router=express.Router();
import jwt from 'jsonwebtoken';
//Importo los controladores correspondientes
import {createProduct,getAllProducts,getProductById,updateProduct,deleteProduct} from '../controllers/productControler';

//MIDDLEWARE DE JWT PARA VERIFICAR SI ESTAMOS AUTENTICADOS

const JWT_SECRET=process.env.JWT_SECRET || 'default-secret';

const verifyToken=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    const token:any=req.headers['x-access-token'];
    if(!token){
        //401 -> Unauthorized
        res.status(403).json({message:'No se encuentra logueado'});
        return
    }

    try{
        const decoded=jwt.verify(token,JWT_SECRET);
        //Si se logra decodificar el token con éxito, quiere decir que el usuario está logeado y le permito seguir
        next();
    }catch(error:any){
        //500 -> Error interno en el servidor
        res.status(500).json({message:error.message});
    }

}

//GET ALL Y GET BY ID -> No necesitan autenticación.
router.get('/',getAllProducts);
router.get('/:id',getProductById);

//Estos ya modifican la base de datos, por tanto necesitan la autenticación...
router.post('/',verifyToken,createProduct);
router.put('/:id',verifyToken,updateProduct);
router.delete('/:id',verifyToken,deleteProduct);





export default router;