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

// Main listings route matching database properties cleanly
app.get('/api/brews', async (req, res) => {
    try { 
        const items = await Brew.findAll();
        res.json(items); 
    } catch (e) { 
        res.status(500).json({ error: e.message }); 
    }
});

// Post creation handler matching custom form models dynamically
app.post('/api/brews', async (req, res) => {
    try {
        const { beans, method, coffeeGrams, waterGrams, rating, tastingNotes } = req.body;
        
        // Dynamic map mapping incoming properties cleanly to Sequelize attributes
        const newRecord = await Brew.create({
            beans: beans || "Unknown Blend",
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

sequelize.sync().then(() => {
    app.listen(10000, '0.0.0.0', () => console.log('☕ Backend unblocked and ready!'));
});
