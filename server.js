const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

const db = new sqlite3.Database('./estoque.db');

// Criar tabela
db.run(`
CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    quantidade INTEGER
)
`);

// Listar produtos
app.get('/produtos', (req, res) => {
    db.all('SELECT * FROM produtos', [], (err, rows) => {
        res.json(rows);
    });
});

// Adicionar produto
app.post('/produtos', (req, res) => {
    const { nome, quantidade } = req.body;
    db.run(
        'INSERT INTO produtos (nome, quantidade) VALUES (?, ?)',
        [nome, quantidade],
        function (err) {
            res.json({ id: this.lastID });
        }
    );
});

// Atualizar estoque
app.put('/produtos/:id', (req, res) => {
    const { quantidade } = req.body;
    db.run(
        'UPDATE produtos SET quantidade = ? WHERE id = ?',
        [quantidade, req.params.id],
        () => {
            res.send('Atualizado');
        }
    );
});

// Deletar produto
app.delete('/produtos/:id', (req, res) => {
    db.run('DELETE FROM produtos WHERE id = ?', [req.params.id], () => {
        res.send('Deletado');
    });
});

app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;

    if (usuario === 'admin' && senha === '1234') {
        res.json({ sucesso: true });
    } else {
        res.json({ sucesso: false });
    }
});
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});