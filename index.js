const express = require('express');
const uuid = require('uuid');

const server = express();
server.use(express.json());

const orders = [];

const checkOrderId = (request, response, next) => {
    const { id } = request.params;

    const index = orders.findIndex(order => order.id === id)

    if(index < 0){
        return response.status(404).json({message: "Order not found"})
    }

    request.orderIndex = index
    request.orderId = id

    next();
};


const showMethodAndURL = (request, response, next) => {
    
    const method = request.method;
    const url = request.url;
 
    console.log(` método: ${method} foi acionado, usando a  URL: ${url}`);

    next();
};
 
server.post('/orders', showMethodAndURL, (request, response) => {

    const { order, clientName, price} = request.body;
    const orderCreated = {
        id: uuid.v4(),
        order: order,
        clientName: clientName,
        price: price,
        status: "Em preparação"
    };

    orders.push(orderCreated)

    return response.status(201).json(orderCreated)

});

server.get('/orders', showMethodAndURL, (request, response) => {

    return response.status(200).json(orders)

});

server.put('/orders/:id', checkOrderId, showMethodAndURL, (request, response) => {

    const { order, clientName, price} = request.body;
    const index = request.orderIndex
    const id = request.orderId

    const updatedOrder = {
        id,
        order: order,
        clientName: clientName,
        price: price,
        status: "pedido alterado - em preparação"
    }

    orders[index] = updatedOrder

    return response.status(201).json(updatedOrder)

});

server.patch('/orders/:id', checkOrderId, showMethodAndURL, (request, response) => {

    const { order, clientName, price} = request.body;
    const index = request.orderIndex
    const id = request.orderId

    const statusOrder = {
        id,
        order: order,
        clientName: clientName,
        price: price,
        status: "pedido pronto"
    }

    orders[index] = statusOrder

    return response.json(statusOrder)

});

server.get('/orders/:id', checkOrderId, showMethodAndURL, (request, response) => {
    const index = request.orderIndex;

    return response.json(orders[index]);
});

server.delete('/orders/:id', checkOrderId, showMethodAndURL,  (request, response) => {

    const index = request.orderIndex
    const id = request.orderId

    orders.splice(index, 1)

    return response.status(204).json()
});

server.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
});

