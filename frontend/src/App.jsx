import React, { useState, useEffect } from 'react';
import './App.css';

// 🌟 DIRECT PRODUCTION ROUTING POINTING TO YOUR VERIFIED LIVE RENDER APP
const API_URL = '/api/brews';

function App() {
  const [brews, setBrews] = useState([]);
  const [filterMethod, setFilterMethod] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
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
      console.error("Database connection failure:", err);
    }
  };

  useEffect(() => {
    fetchBrews();
  }, []);

  const resetForm = () => {
    setBeans('');
    setCoffeeGrams('');
    setWaterGrams('');
    setTastingNotes('');
    setError('');
  };

  const handleAddBrew = async (e) => {
    e.preventDefault();
    if (!beans.trim() || !coffeeGrams || !waterGrams) {
      setError('Required properties cannot be blank.');
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
        resetForm();
        setShowAddModal(false);
        fetchBrews();
      } else {
        setError('Handshake rejected by database validators.');
      }
    } catch (err) {
      setError('Could not establish cloud network handshake.');
    }
  };

  const getBadgeColor = (val) => {
    if (val >= 4) return '#bbf7d0'; 
    if (val == 3) return '#fed7aa'; 
    return '#fecaca'; 
  };

  const displayedBrews = filterMethod === 'All' ? brews : brews.filter(b => b.method === filterMethod);

  return (
    <div className="phone-container">
      <div className="app-content">
        <header className="header-row">
          <h1>Brew log</h1>
          <button className="add-main-btn" onClick={() => setShowAddModal(true)}>Add</button>
        </header>

        <select className="filter-select" value={filterMethod} onChange={e => setFilterMethod(e.target.value)}>
          <option value="All">Filter by method</option>
          <option value="V60">V60</option>
          <option value="Aeropress">Aeropress</option>
          <option value="French Press">French Press</option>
          <option value="Espresso">Espresso</option>
          <option value="Drip coffee">Drip coffee</option>
        </select>

        <div className="brew-list">
          {displayedBrews.length === 0 ? (
            <p className="empty-state">No brew logs found in database. Tap Add to log your first cup!</p>
          ) : (
            displayedBrews.map((brew) => (
              <div key={brew.id} className="wireframe-card">
                <div className="rating-circle" style={{ backgroundColor: getBadgeColor(brew.rating) }}>{brew.rating}</div>
                <div className="card-details">
                  <h3>{brew.beans}</h3>
                  <div className="meta-row">
                    <span className="method-tag">{brew.method}</span>
                    <span className="stat-pill">🫘 {brew.coffeeGrams}g</span>
                    <span className="stat-pill">💧 {brew.waterGrams}g</span>
                  </div>
                  {brew.tastingNotes && <div className="card-notes">{brew.tastingNotes}</div>}
                </div>
              </div>
            ))
          )}
        </div>

        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-header">
              <h2>Add a brew</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            {error && <div style={{ color: 'red', fontSize: '13px', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}
            <form onSubmit={handleAddBrew} className="form-layout">
              <div className="input-block"><label>Beans</label><input type="text" value={beans} onChange={e => setBeans(e.target.value)} /></div>
              <div className="input-block">
                <label>Method</label>
                <select value={method} onChange={e => setMethod(e.target.value)}>
                  <option value="V60">V60</option><option value="Aeropress">Aeropress</option><option value="French Press">French Press</option><option value="Espresso">Espresso</option><option value="Drip coffee">Drip coffee</option>
                </select>
              </div>
              <div className="input-row">
                <div className="input-block"><label>Coffee grams</label><input type="number" step="0.1" value={coffeeGrams} onChange={e => setCoffeeGrams(e.target.value)} /></div>
                <div className="input-block"><label>Water grams</label><input type="number" step="1" value={waterGrams} onChange={e => setWaterGrams(e.target.value)} /></div>
              </div>
              <div className="input-block">
                <label>Rating (1-5)</label>
                <select value={rating} onChange={e => setRating(e.target.value)}>
                  <option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option>
                </select>
              </div>
              <div className="input-block"><label>Tasting notes</label><input type="text" value={tastingNotes} onChange={e => setTastingNotes(e.target.value)} /></div>
              <div className="action-row"><button type="submit" className="save-btn">Save</button></div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
export default App;
