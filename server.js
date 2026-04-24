const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

let produtos = [];
let idAtual = 1;

app.get('/produtos', (req, res) => {
    res.json(produtos);
});

app.post('/produtos', (req, res) => {
    const { nome, quantidade } = req.body;

    const novo = {
        id: idAtual++,
        nome,
        quantidade
    };

    produtos.push(novo);
    res.json(novo);
});

app.put('/produtos/:id', (req, res) => {
    const { quantidade } = req.body;
    const id = parseInt(req.params.id);

    const produto = produtos.find(p => p.id === id);
    if (produto) {
        produto.quantidade = quantidade;
    }

    res.send('Atualizado');
});

app.delete('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    produtos = produtos.filter(p => p.id !== id);

    res.send('Deletado');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Servidor rodando');
});