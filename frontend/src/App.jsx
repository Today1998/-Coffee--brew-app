import React, { useState, useEffect } from 'react';
import './App.css';
// ❌ DELETE THIS OLD RELATIVE PATH LINE:
// const API_URL = '/api/brews';

// ✅ REPLACE IT WITH YOUR REAL LIVE RENDER ADDRESS STRING:
const API_URL = 'https://onrender.com';

function App() {
  const [brews, setBrews] = useState([]);
  const [filterMethod, setFilterMethod] = useState('All');
  const [beans, setBeans] = useState('');
  const [method, setMethod] = useState('V60');
  const [coffeeGrams, setCoffeeGrams] = useState('');
  const [waterGrams, setWaterGrams] = useState('');
  const [rating, setRating] = useState('5');
  const [tastingNotes, setTastingNotes] = useState('');
  const [error, setError] = useState('');

  const fetchBrews = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setBrews(data);
      }
    } catch (err) {
      console.error("Error communicating with backend database:", err);
    }
  };

  useEffect(() => {
    fetchBrews();
  }, []);

  const handleAddBrew = async (e) => {
    e.preventDefault();
    setError('');

    if (!beans.trim() || !coffeeGrams || !waterGrams) {
      setError('Validation Failed: Coffee bean name, coffee weight, and water weight are required fields!');
      return;
    }

    const payload = {
      beans: beans.trim(),
      method,
      coffeeGrams: parseFloat(coffeeGrams),
      waterGrams: parseFloat(waterGrams),
      rating: parseInt(rating),
      tastingNotes: tastingNotes.trim()
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setBeans('');
        setCoffeeGrams('');
        setWaterGrams('');
        setTastingNotes('');
        fetchBrews();
      } else {
        const errData = await response.json();
        setError(errData.error || 'Server rejected submission.');
      }
    } catch (err) {
      setError('Could not connect to the backend server.');
    }
  };

  const handleDeleteBrew = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchBrews();
      }
    } catch (err) {
      console.error("Delete operation failed:", err);
    }
  };

  const displayedBrews = filterMethod === 'All' 
    ? brews 
    : brews.filter(b => b.method === filterMethod);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
        <h1>☕ Coffee Brew Tracker</h1>
        <div style={{ background: '#6d4c41', color: 'white', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
          Brews Counted: {brews.length}
        </div>
      </header>

      <main style={{ marginTop: '20px' }}>
        <section style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #eee' }}>
          <h2>Log a New Brew</h2>
          {error && <div style={{ color: 'red', fontWeight: 'bold', marginBottom: '15px' }}>{error}</div>}
          <form onSubmit={handleAddBrew}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Bean Name:</label>
              <input type="text" value={beans} onChange={e => setBeans(e.target.value)} placeholder="e.g. Ethiopian Yirgacheffe" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Method:</label>
                <select value={method} onChange={e => setMethod(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                  <option value="V60">Hario V60</option>
                  <option value="French Press">French Press</option>
                  <option value="Aeropress">Aeropress</option>
                  <option value="Espresso">Espresso</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Rating:</label>
                <select value={rating} onChange={e => setRating(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                  <option value="5">5 ⭐⭐⭐⭐⭐</option>
                  <option value="4">4 ⭐⭐⭐⭐</option>
                  <option value="3">3 ⭐⭐⭐</option>
                  <option value="2">2 ⭐⭐</option>
                  <option value="1">1 ⭐</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Coffee (g):</label>
                <input type="number" step="0.1" value={coffeeGrams} onChange={e => setCoffeeGrams(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Water (g):</label>
                <input type="number" step="1" value={waterGrams} onChange={e => setWaterGrams(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Notes:</label>
              <textarea value={tastingNotes} onChange={e => setTastingNotes(e.target.value)} style={{ width: '100%', padding: '8px', height: '60px', boxSizing: 'border-box' }}></textarea>
            </div>

            <button type="submit" style={{ background: '#6d4c41', color: 'white', border: 'none', padding: '10px 20px', fontSize: '16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save to Database</button>
          </form>
        </section>

        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2>History Logs</h2>
            <div>
              <label style={{ fontWeight: 'bold' }}>Filter View: </label>
              <select value={filterMethod} onChange={e => setFilterMethod(e.target.value)} style={{ padding: '5px' }}>
                <option value="All">Show All</option>
                <option value="V60">Hario V60</option>
                <option value="French Press">French Press</option>
                <option value="Aeropress">Aeropress</option>
                <option value="Espresso">Espresso</option>
              </select>
            </div>
          </div>

          {displayedBrews.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No brew logs found.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {displayedBrews.map((brew) => (
                <div key={brew.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0 }}>{brew.beans}</h3>
                    <span style={{ background: '#efebe9', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{brew.method}</span>
                  </div>
                  <p style={{ margin: '5px 0' }}>⚖️ <strong>Ratio:</strong> {brew.coffeeGrams}g / {brew.waterGrams}g</p>
                  <p style={{ margin: '5px 0' }}>⭐ <strong>Rating:</strong> {brew.rating}/5</p>
                  {brew.tastingNotes && <p style={{ fontSize: '13px', color: '#555', background: '#f5f5f5', padding: '5px', borderRadius: '4px', marginTop: '10px' }}>"{brew.tastingNotes}"</p>}
                  <button onClick={() => handleDeleteBrew(brew.id)} style={{ marginTop: '10px', background: '#ffebee', color: '#c62828', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>🗑️ Delete</button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
