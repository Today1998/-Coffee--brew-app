const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const Brew = require('./models/Brew');

const app = express();

// 🌟 ALLOW ALL CROSS-ORIGIN HEADERS FOR VERCEL DOMAINS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/api/brews', async (req, res) => {
    try { 
        const items = await Brew.findAll();
        res.json(items); 
    } catch (e) { 
        res.status(500).json({ error: e.message }); 
    }
});

app.post('/api/brews', async (req, res) => {
    try { 
        const newItem = await Brew.create(req.body);
        res.status(201).json(newItem); 
    } catch (e) { 
        res.status(400).json({ error: e.message }); 
    }
});

sequelize.sync().then(() => {
    app.listen(10000, '0.0.0.0', () => console.log('☕ Backend fully open to Vercel traffic on port 10000!'));
});
