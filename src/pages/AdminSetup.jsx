// src/pages/AdminSetup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminSetup = () => {
  const [file, setFile] = useState(null);
  const [numTeams, setNumTeams] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !numTeams) {
      setError('Oops! Please choose a projects file AND enter how many teams are playing!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('numTeams', numTeams);

    try {
      // Hook to backend later
      const res = await fetch('http://localhost:5000/api/setup', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const { error } = await res.json();
        setError(error || 'Something went wrong. Try again, champion!');
        return;
      }

      navigate('/game');
    } catch (err) {
      setError(`Uh-oh! Can't reach the server. Check your connection and try again.`);
    }
  };

  return (
    <div
      className="setup-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        // backgroundColor: '#f0f8ff',
        minHeight: '100vh',
        color: '#f0f8ff',
      }}
    >
      <h1 style={{ fontSize: '1.5rem', color: '#007acc', marginBottom: '10px' }}>
        🎉 Welcome, Project Allocator! 🎉
      </h1>
      <p style={{ fontSize: '1.2rem', maxWidth: '480px', textAlign: 'center', marginBottom: '30px' }}>
        Ready to mix things up and assign those projects the fun way? Upload your projects CSV,
        tell me how many teams are in the arena, and let the game begin!
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          // backgroundColor: '#ffffff',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
          maxWidth: '420px',
          width: '100%',
          textAlign: 'left',
        }}
      >
        <label
          htmlFor="projectFile"
          style={{ fontWeight: 'bold', fontSize: '1.1rem', display: 'block', marginBottom: '8px' }}
        >
          🎲 Pick Your Projects File (CSV)
        </label>
        <input
          id="projectFile"
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
        />

        <label
          htmlFor="numTeams"
          style={{
            marginTop: '25px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          👥 How many teams will play?
        </label>
        <input
          id="numTeams"
          type="number"
          min="1"
          value={numTeams}
          onChange={(e) => setNumTeams(e.target.value)}
          placeholder="e.g. 3"
          required
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '1rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />

        {error && (
          <p
            role="alert"
            style={{
              color: '#d8000c',
              backgroundColor: '#ffbaba',
              padding: '10px',
              borderRadius: '6px',
              marginTop: '20px',
              fontWeight: '600',
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          style={{
            marginTop: '30px',
            backgroundColor: '#007acc',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            padding: '14px 0',
            width: '100%',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,122,204,0.5)',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#005fa3')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007acc')}
        >
          🚀 Let’s Shuffle & Play!
        </button>
      </form>

      <footer style={{ marginTop: '40px', fontStyle: 'italic', color: '#555' }}>
        * No teams were harmed in the making of this game. 😉
      </footer>
    </div>
  );
};

export default AdminSetup;
