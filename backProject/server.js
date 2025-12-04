import express from 'express';
import { engine } from 'express-handlebars';
import productsRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js';
import viewsRouter from './routers/views.router.js';
import { Server } from 'socket.io';

const app = express();

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use('/', viewsRouter);


const httpServer = app.listen(PORT, ()=>{
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

export const io = new Server(httpServer);

io.on('connection', (socket)=>{
  console.log('Nuevo cliente conectado');

  //socket.emit('productosActualizados');
});
