const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const Brew = require('./models/Brew');

const app = express();
const PORT = process.env.PORT || 5000;

// Universal Middleware
app.use(cors());
app.use(express.json()); // Parses incoming request bodies as JSON

// 🛑 CUSTOM BACKEND VALIDATION MIDDLEWARE (Strict Bootcamp Spec)
const validateBrewInput = (req, res, next) => {
    const { beans, method, coffeeGrams, waterGrams, rating } = req.body;
    
    // Checks for empty fields or missing properties
    if (!beans || !method || coffeeGrams === undefined || waterGrams === undefined || rating === undefined) {
        return res.status(400).json({ error: "Validation Failed: All fields are required." });
    }
    
    if (beans.trim() === "" || method.trim() === "") {
        return res.status(400).json({ error: "Validation Failed: Fields cannot be blank text strings." });
    }
    
    next(); // Pass control forward safely to the route handler
};

// 📌 1. READ ALL BREWS (With filter support)
app.get('/api/brews', async (req, res) => {
    try {
        const { method } = req.query;
        let queryOptions = {};
        
        // Exposes list filtering criteria by brew technique if requested
        if (method && method !== 'All') {
            queryOptions.where = { method };
        }
        
        const brews = await Brew.findAll(queryOptions);
        res.status(200).json(brews);
    } catch (error) {
        res.status(500).json({ error: "Server error fetching logs." });
    }
});

// 📌 2. CREATE A BREW ENTRY
app.post('/api/brews', validateBrewInput, async (req, res) => {
    try {
        const newBrew = await Brew.create(req.body);
        res.status(201).json(newBrew);
    } catch (error) {
        res.status(500).json({ error: "Server error saving logs." });
    }
});

// 📌 3. EDIT & UPDATE AN ENTRY
app.put('/api/brews/:id', validateBrewInput, async (req, res) => {
    try {
        const { id } = req.params;
        const brew = await Brew.findByPk(id);
        
        if (!brew) {
            return res.status(404).json({ error: "Brew record entry not found." });
        }
        
        await brew.update(req.body);
        res.status(200).json(brew);
    } catch (error) {
        res.status(500).json({ error: "Server error updating log record." });
    }
});

// 📌 4. DELETE AN ENTRY
app.delete('/api/brews/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const brew = await Brew.findByPk(id);
        
        if (!brew) {
            return res.status(404).json({ error: "Brew record entry not found." });
        }
        
        await brew.destroy();
        res.status(200).json({ message: "Brew log entry successfully removed." });
    } catch (error) {
        res.status(500).json({ error: "Server error eliminating log entry." });
    }
});

// Initialize DB Connections & Launch Application Hardware Listener
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`☕ Backend listening comfortably on port ${PORT}!`);
    });
});
