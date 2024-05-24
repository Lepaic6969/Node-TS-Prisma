//Este servicio lo usamos para encriptar nuestra contraseña
import bcrypt from 'bcrypt';

const SALT_ROUNDS:number=10; //Número de veces que se repite el algoritmo

//Para encriptar la contraseña
export const hashPassword=async(password:string):Promise<string>=>{
    return await bcrypt.hash(password,SALT_ROUNDS);
}

//Para comparar contraseñas.

export const comparePassword=async(password:string,encryptedPassword:string):Promise<boolean>=>{
    return await bcrypt.compare(password,encryptedPassword);
}
