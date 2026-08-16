import React, { useState, useEffect } from 'react';
import './App.css';

// Direct production connection to your live Render API server
https://coffee-brew-app.onrender.comconst API_URL = 'https://onrender.com';


function App() {
  const [brews, setBrews] = useState([]);
  const [filterMethod, setFilterMethod] = useState('All');

  // View switches
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBrew, setEditingBrew] = useState(null);

  // Form input field elements
  const [beans, setBeans] = useState('');
  const [method, setMethod] = useState('Aeropress');
  const [coffeeGrams, setCoffeeGrams] = useState('');
  const [waterGrams, setWaterGrams] = useState('');
  const [rating, setRating] = useState('3');
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
      console.error('Error connecting to production database server:', err);
    }
  };

  useEffect(() => {
    fetchBrews();
  }, []);

  useEffect(() => {
    document.title = `Brews: ${brews.length}`;
  }, [brews]);

  const resetForm = () => {
    setBeans('');
    setMethod('Aeropress');
    setCoffeeGrams('');
    setWaterGrams('');
    setRating('3');
    setTastingNotes('');
    setError('');
  };

  const openEditModal = (brew) => {
    setEditingBrew(brew);
    setBeans(brew.beans);
    setMethod(brew.method);
    setCoffeeGrams(brew.coffeeGrams);
    setWaterGrams(brew.waterGrams);
    setRating(brew.rating.toString());
    setTastingNotes(brew.tastingNotes || '');
    setError('');
  };

  // 📌 CREATE
  const handleAddBrew = async (e) => {
    e.preventDefault();
    if (!beans.trim() || !method || !coffeeGrams || !waterGrams) {
      setError('Validation Failed: Coffee bean name, coffee weight, and water weight are required fields!');
      return;
    }

    const payload = {
      beans: beans.trim(),
      method,
      coffeeGrams: parseFloat(coffeeGrams),
      waterGrams: parseFloat(waterGrams),
      rating: parseInt(rating),
      tastingNotes: tastingNotes.trim(),
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        resetForm();
        setShowAddModal(false);
        fetchBrews();
      }
    } catch (err) {
      setError('Could not establish cloud network handshake.');
    }
  };

  // 📌 UPDATE
  const handleUpdateBrew = async (e) => {
    e.preventDefault();
    if (!beans.trim() || !method || !coffeeGrams || !waterGrams) {
      setError('Validation Failed: Required fields cannot be empty.');
      return;
    }

    const payload = {
      beans: beans.trim(),
      method,
      coffeeGrams: parseFloat(coffeeGrams),
      waterGrams: parseFloat(waterGrams),
      rating: parseInt(rating),
      tastingNotes: tastingNotes.trim(),
    };

    try {
      const response = await fetch(`${API_URL}/${editingBrew.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        resetForm();
        setEditingBrew(null);
        fetchBrews();
      }
    } catch (err) {
      setError('Update execution link error.');
    }
  };

  // 📌 DELETE
  const handleDeleteBrew = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        resetForm();
        setEditingBrew(null);
        fetchBrews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getBadgeColor = (val) => {
    if (val >= 4) return '#bbf7d0';
    if (val === 3) return '#fed7aa';
    return '#fecaca';
  };

  const displayedBrews =
    filterMethod === 'All' || filterMethod === 'Filter by method'
      ? brews
      : brews.filter((b) => b.method.toLowerCase() === filterMethod.toLowerCase());

  return (
    <div className="phone-container">
      <div className="app-content">
        {/* MAIN LEDGER LIST VIEW */}
        <header className="header-row">
          <h1>Brew log</h1>
          <button
            className="add-main-btn"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
          >
            Add
          </button>
        </header>

        <select
          className="filter-select"
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value)}
        >
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
                <div className="rating-circle" style={{ backgroundColor: getBadgeColor(brew.rating) }}>
                  {brew.rating}
                </div>
                <div className="card-details">
                  <h3>{brew.beans}</h3>
                  <div className="meta-row">
                    <span className="method-tag">{brew.method}</span>
                    <span className="stat-pill">🫘 {brew.coffeeGrams}g</span>
                    <span className="stat-pill">💧 {brew.waterGrams}g</span>
                  </div>
                  {brew.tastingNotes && <div className="card-notes">{brew.tastingNotes}</div>}
                </div>
                <button className="edit-action-btn" onClick={() => openEditModal(brew)}>
                  📝
                </button>
              </div>
            ))
          )}
        </div>

        {/* ADD OVERLAY CARD PANEL */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-header">
              <h2>Add a brew</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                ✕
              </button>
            </div>
            {error && (
              <div style={{ color: 'red', fontSize: '13px', marginBottom: '15px', fontWeight: 'bold' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleAddBrew} className="form-layout">
              <div className="input-block">
                <label>Beans</label>
                <input
                  type="text"
                  value={beans}
                  onChange={(e) => setBeans(e.target.value)}
                  placeholder="e.g. Zimbabwean highlands"
                />
              </div>
              <div className="input-block">
                <label>Method</label>
                <select value={method} onChange={(e) => setMethod(e.target.value)}>
                  <option value="Aeropress">Aeropress</option>
                  <option value="V60">V60</option>
                  <option value="French Press">French Press</option>
                  <option value="Espresso">Espresso</option>
                  <option value="Drip coffee">Drip coffee</option>
                </select>
              </div>
              <div className="input-row">
                <div className="input-block">
                  <label>Coffee grams</label>
                  <input
                    type="number"
                    step="0.1"
                    value={coffeeGrams}
                    onChange={(e) => setCoffeeGrams(e.target.value)}
                    placeholder="15"
                  />
                </div>
                <div className="input-block">
                  <label>Water grams</label>
                  <input
                    type="number"
                    step="1"
                    value={waterGrams}
                    onChange={(e) => setWaterGrams(e.target.value)}
                    placeholder="240"
                  />
                </div>
              </div>
              <div className="input-block">
                <label>Rating (1-5)</label>
                <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />
              </div>
              <div className="input-block">
                <label>Tasting notes</label>
                <input
                  type="text"
                  value={tastingNotes}
                  onChange={(e) => setTastingNotes(e.target.value)}
                  placeholder="Nutty, smooth body..."
                />
              </div>
              <div className="action-row">
                <button type="submit" className="save-btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        )}

        {/* EDIT OVERLAY CARD PANEL */}
        {editingBrew && (
          <div className="modal-overlay">
            <div className="modal-header">
              <h2>Edit a brew</h2>
              <button className="close-btn" onClick={() => setEditingBrew(null)}>
                ✕
              </button>
            </div>
            {error && (
              <div style={{ color: 'red', fontSize: '13px', marginBottom: '15px', fontWeight: 'bold' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleUpdateBrew} className="form-layout">
              <div className="input-block">
                <label>Beans</label>
                <input type="text" value={beans} onChange={(e) => setBeans(e.target.value)} />
              </div>
              <div className="input-block">
                <label>Method</label>
                <select value={method} onChange={(e) => setMethod(e.target.value)}>
                  <option value="Aeropress">Aeropress</option>
                  <option value="V60">V60</option>
                  <option value="French Press">French Press</option>
                  <option value="Espresso">Espresso</option>
                  <option value="Drip coffee">Drip coffee</option>
                </select>
              </div>
              <div className="input-row">
                <div className="input-block">
                  <label>Coffee grams</label>
                  <input
                    type="number"
                    step="0.1"
                    value={coffeeGrams}
                    onChange={(e) => setCoffeeGrams(e.target.value)}
                  />
                </div>
                <div className="input-block">
                  <label>Water grams</label>
                  <input
                    type="number"
                    step="1"
                    value={waterGrams}
                    onChange={(e) => setWaterGrams(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-block">
                <label>Rating (1-5)</label>
                <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />
              </div>
              <div className="input-block">
                <label>Tasting notes</label>
                <input type="text" value={tastingNotes} onChange={(e) => setTastingNotes(e.target.value)} />
              </div>
              <div className="action-row split-actions">
                <button type="submit" className="save-btn">
                  Update
                </button>
                <button type="button" className="delete-btn" onClick={() => handleDeleteBrew(editingBrew.id)}>
                  Delete
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
