### Dependencias de desarrollo:
**npm install ts-node-dev @types/express @types/jsonwebtoken @types/bcrypt @types/node rimraf prisma --save-dev**
* ts-node-dev -> Para poder levantar el servidor en TS, es como el nodemon de TS.
* @types/express -> Para agregarle el tipado a express.
* @types/jsonwebtoken -> Para agregarle el tipado al JWT.
* @types/bcrypt -> Para agregarle el tipado al encriptador
* rimraf -> Para eliminar carpetas, esto lo utilizaremos para realizar el build

### Dependencias de producción:
**npm install  express jsonwebtoken bcrypt dotenv @prisma/client typescript**
* @prisma/client -> Cliente de prisma, para que se levante después en el servidor.

### Inicializar Typescript en mi proyecto
**npx tsc --init --outDir dist/ --rootDir src**
* npx -> Node Package Executor
* outDir -> Será la carpeta con el compilado del proyecto, la que subimos a producción (Todo en JS).
* rootDir -> Es el directorio donde trabajaremos nuestros archivos TS.

### Agregando una nueva configuración a nuestro proyecto
En el archivo **tsconfig.json** agregas **"exclude":["node_modules","dist"]** y también **"include":["src"]**
Estas instrucciones deben ir fuera del "compilerOptions".
Esto hace que no se esté escuchando estas dos carpetas(node_modules y dist) para compilarlas a JS. Y para que si escuche src que es donde tenemos nuestros archivos TS.

### Scripts de nuestro package para dev,start y build
* "dev": "tsnd --respawn --clear src/server.ts" -> Este hace las veces de nodemon para nuestro proyecto con TS
                                                este es el que usa el paquete "ts-node-dev".
* "build":"rimraf ./dist && tsc" -> Este es para compilar el proyecto a JS y generar la carpeta dist
* "start":"node dist/server.js" -> Este es para poder arrancar la aplicación en el servidor donde alojemos nuestro proyecto en producción
### Inicializando prisma

* Levantamos prisma **npx prisma init**, con esto se genera una DATABASE_URL en las variables de entorno  
(Archivo '.env'), que lo debes editar para que quede correctamente configurada la dirección de conexión, con el  usuario y la contraseña correspondientes. Quedaría algo así...  
DATABASE_URL="postgresql://usuario:password@localhost:5432/nombre_base_de_datos"  
Para nuestro caso la anterior URL apuntaría al puerto 5434, esto debido a que el 5432 ya estaba ocupado por el   PostgreSQL del pgAdmin, por lo tanto quedaría algo así:  
DATABASE_URL="postgresql://usuario:password@localhost:5434/nombre_base_de_datos"  

* Definimos el modelo de usuario(model user) en el archivo "schema.prisma". La estructura vendría dada de la  siguiente manera:  

model user {  
  id    Int     @id @default(autoincrement())  
  email String  @unique  
  password  String  
}  

Y ahora ejecutas **npx prisma generate**, en teoría aquí se lee el modelo y me genera el cliente de prisma en   base al modelo que hicimos.  
 
### Haciendo el archivo .yml para la base de datos.
* Creas en la raiz del proyecto un archivo con el nombre de 'docker-compose.yml' y pones la respectiva configuración que se puede consultar en el mismo archivo.  

* Ahora levantamos nuestro docker **docker-compose up -d** y hacemos que prisma genere nuestra base de datos   "mydb"-> Nombre que le habíamos puesto a nuestra base de datos en las variables de entorno...  
 **npx prisma migrate dev**, con esto ya tenemos a nuestro proyecto conectado con la base de datos de PostgreSQL.  

### Agregando una nueva tabla al proyecto  
* Pones el nuevo modelo en el archivo **schema.prisma**  
* Ejecutas **npx prisma migrate dev --name nombre_nuevo_modelo**  
* Por buenas prácticas actualizas el cliente de prisma **npx prisma generate**  

### Compilando el proyecto.
Una vez el proyecto haya finalizado lo compilamos para generar la carpeta dist, esta carpeta es la que va a   interpretar el servidor.  
**npm run build** y subimos el proyecto a GitHub.  

###  Subiendo el proyecto a Railway  
* Seleccionamos el proyecto ya subido en GitHub desde Railway y le damos desplegar ahora
* Creamos nuestra base de datos de postgres de postgres dándole click derecho a la parte izquierda de la interfaz que nos aparece...  
![alt text](image.png)  
* Agregamos las variables de entorno al proyecto  
![alt text](image-1.png)  
Pones el JWT_SECRET tal cuál lo tienes en las variables de entorno y las siguientes la URL de la Base de Datos la pones así:  
DATABASE_URL=${{Postgres.DATABASE_URL}}  

Una vez realizado esto le das en Deploy al proyecto(El botoncito púrpura que dice deploy)...  
![alt text](image-2.png)  

* Ahora Vas a "settings" y le das en el apartado "Public Networking" a "generate domain" para que genere la URL   para consumir la api.  
![alt text](image-3.png)  

* Por último creas las tablas en la base de datos docker para que todo pueda funcioner así...  
![alt text](image-6.png)  
![alt text](image-7.png)


