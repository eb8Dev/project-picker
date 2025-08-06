import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Summary = () => {
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/results');
        if (!res.ok) throw new Error('Failed to fetch results');
        const data = await res.json();
        setResults(data.allocatedProjects);
      } catch (err) {
        setError('😢 Whoops! Could not load the final results. Try refreshing?');
      }
    };

    fetchResults();
  }, []);

  if (error) {
    return (
      <p
        role="alert"
        style={{
          color: '#b71c1c',
          backgroundColor: '#ffcdd2',
          padding: '15px',
          borderRadius: '10px',
          maxWidth: '600px',
          margin: '40px auto',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          textAlign: 'center',
          fontFamily: "'Comic Sans MS', cursive, sans-serif",
        }}
      >
        {error}
      </p>
    );
  }

  if (!results) {
    return (
      <p
        style={{
          fontSize: '1.5rem',
          fontFamily: "'Comic Sans MS', cursive, sans-serif",
          textAlign: 'center',
          marginTop: '80px',
          color: '#007acc',
          fontWeight: 'bold',
        }}
      >
        🔄 Loading final results... Please wait!
      </p>
    );
  }

  const teams = Object.entries(results);

  return (
    <div
      style={{
        maxWidth: '640px',
        margin: '40px auto',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        color: '#444',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          color: 'white',
          marginBottom: '30px',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px #aaa',
        }}
      >
        🎉 Project Allocation Results 🎉
      </h1>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {teams.map(([team, project]) => (
          <li
            key={team}
            style={{
              backgroundColor: '#e0f7fa',
              marginBottom: '15px',
              borderRadius: '12px',
              padding: '15px 20px',
              fontSize: '1.4rem',
              boxShadow: '0 2px 8px rgba(0, 123, 204, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontWeight: '600',
            }}
          >
            <span
              style={{
                backgroundColor: '#007acc',
                color: 'white',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.2rem',
                boxShadow: '0 0 6px #007acc',
              }}
              aria-label={`Team ${team}`}
            >
              {team}
            </span>
            Team {team} ➡️ <em style={{ color: '#004a75' }}>{project}</em>
          </li>
        ))}
      </ul>

      <div
        style={{
          marginTop: '40px',
          color: 'white',
          padding: '25px',
          borderRadius: '16px',
          fontSize: '1.8rem',
          fontWeight: 'bold',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(21, 87, 36, 0.4)',
          userSelect: 'none',
        }}
      >
        🏆 All the best to all teams! 🏆
      </div>

      {/* Start Again Button */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#d32f2f',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '15px 40px',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.6)',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#b71c1c')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#d32f2f')}
          aria-label="Start the game again"
        >
          🔄 Start Again
        </button>
      </div>
    </div>
  );
};

export default Summary;
