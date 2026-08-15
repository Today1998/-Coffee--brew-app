const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const Brew = require('./models/Brew');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/brews', async (req, res) => {
    try {
        const brews = await Brew.findAll();
        res.json(brews);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/brews', async (req, res) => {
    try {
        const newBrew = await Brew.create(req.body);
        res.status(201).json(newBrew);
    } catch (e) { res.status(400).json({ error: e.message }); }
});

sequelize.sync().then(() => {
    app.listen(5000, () => console.log('☕ Backend successfully live on port 5000!'));
});
