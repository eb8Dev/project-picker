import React from 'react';
import './Card.css';

const Card = ({ isFlipped, onClick, index, disabled }) => {
  return (
    <div className={`card ${disabled ? 'disabled' : ''}`} onClick={() => !disabled && onClick(index)}>
      <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
        <div className="card-front">?</div>
        <div className="card-back">🎓</div>
      </div>
    </div>
  );
};

export default Card;
