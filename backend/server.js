const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const Brew = require('./models/Brew');

const app = express();

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
        const { beans, method, coffeeGrams, waterGrams, rating, tastingNotes } = req.body;
        
        const newRecord = await Brew.create({
            beans: beans || "Default Blend",
            method: method || "V60",
            coffeeGrams: parseFloat(coffeeGrams) || 15.0,
            waterGrams: parseFloat(waterGrams) || 240.0,
            rating: parseInt(rating) || 3,
            tastingNotes: tastingNotes || ""
        });
        
        res.status(201).json(newRecord);
    } catch (e) { 
        res.status(400).json({ error: e.message }); 
    }
});

// Enforce database restructuring alter maps to reset any mismatched columns safely
sequelize.sync({ alter: true }).then(() => {
    app.listen(10000, '0.0.0.0', () => console.log('☕ Backend sync locked in and active!'));
});
