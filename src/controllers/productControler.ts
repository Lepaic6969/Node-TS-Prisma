import { Request,Response } from "express";
import prisma from "../models/prisma";

export const createProduct=async(req:Request,res:Response):Promise<void>=>{
    const {name,stock}=req.body;
    //400 -> Bad Request
    if(!stock){
        res.status(400).json({message:"¡El stock es obligatorio!"});
        return
    }
    if(!name){
        res.status(400).json({message:"¡El name es obligatorio!"});
        return
    }
    try{
        const newProduct=await prisma.product.create(
            {
                data:{
                    name,
                    stock
                }
            }
        );

        //201 -> Created
        res.status(201).json(newProduct);

    }catch(error:any){
        //500 -> Error interno del servidor
        res.status(500).json({message:error.message});
    }
}

export const getAllProducts=async(req:Request,res:Response):Promise<void>=>{
    try{
        const products=await prisma.product.findMany();
        //200 -> Petición exitosa
        res.status(200).json(products);
    }catch(error:any){
        //500 -> Error interno del servidor
        res.status(500).json({message:error.message});
    }
}

export const getProductById=async(req:Request,res:Response):Promise<void>=>{
    const userId=parseInt(req.params.id); //Lo parseamos porque el where necesita un tipo number

    try{
        const product=await prisma.product.findUnique({
            where:{
                id:userId
            }
        });
        //Valido que el producto exista...
        if(!product){
            //404->No encontrado
            res.status(404).json({message:`El producto con id:${userId}, no existe`});
            return
        }
        //200 -> Petición exitosa
        res.status(200).json(product); 
    }catch(error:any){
        //500 -> Error interno del servidor
        res.status(500).json({message:error.message});
    }
}

export const updateProduct=async(req:Request,res:Response):Promise<void>=>{
    const userId=parseInt(req.params.id); //Lo parseamos porque el where necesita un tipo number
    const dataToUpdate:any={...req.body};
    try{
        const product=await prisma.product.update({
            where:{
                id:userId
            },
            data:dataToUpdate
        });

        //200 -> Petición exitosa
        res.status(200).json(product);
    }catch(error:any){
        if(error?.code ==='P2025'){
            res.status(404).json({message:'El producto no existe, no se puede editar'});
            return
        }
        //500 -> Error interno del servidor
        res.status(500).json({message:error.message});
    }
}

export const deleteProduct=async(req:Request,res:Response):Promise<void>=>{
    const userId=parseInt(req.params.id); //Lo parseamos porque el where necesita un tipo number
    try{
        const userDeleted=await prisma.product.delete({
            where:{
                id:userId
            }
        });
        res.status(200).json(userDeleted);
    }catch(error:any){
        if(error?.code ==='P2025'){
            res.status(404).json({message:`El usuario con id:${userId} no existe en la Base de Datos`});
            return
        }
        //500 -> Error interno del servidor
        res.status(500).json({message:error.message});
    }
}

