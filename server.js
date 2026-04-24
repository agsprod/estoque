const express = require('express');
const Database = require('better-sqlite3');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const db = new Database('estoque.db');

// Criar tabela
db.prepare(`
CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    quantidade INTEGER
)
`).run();

// Listar produtos
app.get('/produtos', (req, res) => {
    const rows = db.prepare('SELECT * FROM produtos').all();
    res.json(rows);
});

// Adicionar produto
app.post('/produtos', (req, res) => {
    const { nome, quantidade } = req.body;

    const result = db.prepare(
        'INSERT INTO produtos (nome, quantidade) VALUES (?, ?)'
    ).run(nome, quantidade);

    res.json({ id: result.lastInsertRowid });
});

// Atualizar estoque
app.put('/produtos/:id', (req, res) => {
    const { quantidade } = req.body;

    db.prepare(
        'UPDATE produtos SET quantidade = ? WHERE id = ?'
    ).run(quantidade, req.params.id);

    res.send('Atualizado');
});

// Deletar produto
app.delete('/produtos/:id', (req, res) => {
    db.prepare('DELETE FROM produtos WHERE id = ?')
      .run(req.params.id);

    res.send('Deletado');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Servidor rodando');
});