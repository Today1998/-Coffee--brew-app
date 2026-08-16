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
        res.json(await Brew.findAll()); 
    } catch (e) { 
        res.status(500).json({ error: e.message }); 
    }
});

app.post('/api/brews', async (req, res) => {
    try {
        const { beans, method, coffeeGrams, waterGrams, rating, tastingNotes } = req.body;

        // Ultimate conversion fallback layer to prevent validation blocks
        const parsedCoffee = parseFloat(coffeeGrams);
        const parsedWater = parseFloat(waterGrams);
        const parsedRating = parseInt(rating);

        if (!beans || !method || isNaN(parsedCoffee) || isNaN(parsedWater)) {
            return res.status(400).json({ error: "Missing required properties" });
        }

        const newRecord = await Brew.create({
            beans: beans.toString().trim(),
            method: method.toString().trim(),
            coffeeGrams: parsedCoffee,
            waterGrams: parsedWater,
            rating: isNaN(parsedRating) ? 3 : parsedRating,
            tastingNotes: tastingNotes ? tastingNotes.toString().trim() : ""
        });
        
        res.status(201).json(newRecord);
    } catch (e) { 
        res.status(400).json({ error: e.message }); 
    }
});

// Enforce an absolute table reset to lock the fresh columns in place
sequelize.sync({ force: true }).then(() => {
    app.listen(10000, '0.0.0.0', () => console.log('☕ Full-stack backend completely unblocked!'));
});
