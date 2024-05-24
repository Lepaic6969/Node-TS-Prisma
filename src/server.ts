//Este es nuestro verdadero punto de entrada a nuestra aplicación
import app from './app';

const PORT=process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server is running on: http://localhost:${PORT}`);
});