const { response } = require('express');
const express = require('express');
const fs = require('fs');
const app = express();

app.get('/', (req, res) => {
    return res.send('Hii');
});

app.get('/todos', (req, res) => {
    fs.readFile('./store/todos.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Sorry, something went wrong')
        }
        const todos = JSON.parse(data);
        return res.json({todos: todos});
    })
});

app.listen(3000, () => {
    console.log('Application running on http://localhost:3000');
})