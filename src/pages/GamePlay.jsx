import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FlipMove from 'react-flip-move';
import Confetti from 'react-confetti';

const GRID_COLUMNS = 5;

const GamePlay = () => {
    const [cards, setCards] = useState([]);
    const [shuffledIndices, setShuffledIndices] = useState([]);
    const [teamNumber, setTeamNumber] = useState('');
    const [error, setError] = useState('');
    const [assignedTeams, setAssignedTeams] = useState({});
    const [gameFinished, setGameFinished] = useState(false);
    const [flippedCardIndex, setFlippedCardIndex] = useState(null); // new
    const [flippedCardProject, setFlippedCardProject] = useState(null); // store project title to show
    const [isShuffling, setIsShuffling] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [totalTeams, setTotalTeams] = useState(0);
    const [showGameEndConfetti, setShowGameEndConfetti] = useState(false);

    const navigate = useNavigate();
    const containerRef = useRef(null);

    const fetchGameState = async (suppressFinishCheck = false) => {
        try {
            const resCards = await fetch('http://localhost:5000/api/cards');
            const dataCards = await resCards.json();
            setCards(dataCards.cards);

            const resResults = await fetch('http://localhost:5000/api/results');
            const dataResults = await resResults.json();
            setAssignedTeams(dataResults.allocatedProjects);

            const resTotal = await fetch('http://localhost:5000/api/totalTeams');
            const dataTotal = await resTotal.json();
            setTotalTeams(dataTotal.totalTeams);

            if (!suppressFinishCheck && Object.keys(dataResults.allocatedProjects).length >= dataTotal.totalTeams) {
                setGameFinished(true);
            }

            if (shuffledIndices.length === 0) {
                setShuffledIndices(dataCards.cards.map((_, i) => i));
            }
        } catch (err) {
            setError(`Failed to load game state., ${err}`);
        }
    };


    useEffect(() => {
        fetchGameState();
    }, []);


    const shuffleArray = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    const handleCardClick = async (shuffledIndex) => {
        if (!teamNumber) {
            setError('Please enter your team number first.');
            return;
        }

        if (assignedTeams[teamNumber]) {
            setError('This team already has a project assigned.');
            return;
        }

        const actualIndex = shuffledIndices[shuffledIndex];

        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/assign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamNumber, index: actualIndex }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Assignment failed.');
                return;
            }

            setFlippedCardIndex(shuffledIndex);
            setFlippedCardProject(data.project);
            setTeamNumber('');
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 10000);

            const updatedAssignedTeams = {
                ...assignedTeams,
                [teamNumber]: data.project,
            };
            const totalAssigned = Object.keys(updatedAssignedTeams).length;

            if (totalAssigned >= totalTeams) {
                await fetchGameState(true); // suppress finish check
                setShowConfetti(true); // show for last card
                setShowGameEndConfetti(true); // show after game ends

                setTimeout(() => {
                    setGameFinished(true);
                }, 5000);

                // Stop game-end confetti after a few seconds
                setTimeout(() => {
                    setShowGameEndConfetti(false);
                }, 10000);
            } else {
                await fetchGameState(); // normal check
            }

        } catch {
            setError('Server error.');
        }
    };



    const handleTeamSubmit = () => {
        if (!teamNumber) {
            setError('Please enter a valid team number.');
            return;
        }
        if (assignedTeams[teamNumber]) {
            setError('This team already has a project assigned.');
            return;
        }

        setError('');
        setFlippedCardIndex(null); // reset flip on new turn
        setFlippedCardProject(null);
        setIsShuffling(true);

        const newShuffle = shuffleArray(shuffledIndices);

        setTimeout(() => {
            setShuffledIndices(newShuffle);
            setIsShuffling(false);
        }, 800);
    };

    const handleFinish = () => {
        navigate('/summary');
    };

    return (
        <div
            style={{ maxWidth: '900px', margin: 'auto', padding: '20px' }}
            ref={containerRef}
        >
            <h2>🎯 Select your project here</h2>

            {!gameFinished ? (
                <>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginTop: '20px',
                        flexWrap: 'wrap'
                    }}>
                        <input
                            type="number"
                            placeholder="Enter team number"
                            value={teamNumber}
                            min={1}
                            max={totalTeams}
                            onChange={(e) => setTeamNumber(e.target.value)}
                            disabled={isShuffling}
                            style={{
                                fontSize: '1.1rem',
                                padding: '0.6rem 1rem',
                                width: '180px',
                                borderRadius: '8px',
                                border: '1px solid #ccc',
                                outline: 'none',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                        />
                        <button
                            onClick={handleTeamSubmit}
                            disabled={isShuffling || !teamNumber}
                            style={{
                                padding: '0.6rem 1.2rem',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                transition: 'background-color 0.3s',
                                opacity: isShuffling || !teamNumber ? 0.6 : 1
                            }}
                        >
                            Start Turn
                        </button>
                    </div>

                    {error && (
                        <p style={{ color: '#dc3545', marginTop: '10px', fontWeight: '500' }}>{error}</p>
                    )}
                    <p style={{ marginTop: '15px', fontSize: '1rem', fontWeight: '500', color: '#555' }}>
                        🧠 Teams assigned: <strong>{Object.keys(assignedTeams).length} / {totalTeams}</strong>
                    </p>


                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${GRID_COLUMNS}, 1fr)`,
                            gap: '10px',
                            marginTop: '30px',
                            perspective: '1000px', // Needed for 3D effect
                        }}
                    >
                        <FlipMove
                            typeName={null}
                            duration={600}
                            easing="ease-in-out"
                            staggerDurationBy={20}
                        >
                            {shuffledIndices.map((actualIndex, i) => {
                                const card = cards[actualIndex];
                                const isFlipped = i === flippedCardIndex;
                                return (
                                    <div
                                        key={actualIndex}
                                        onClick={() => !isShuffling && card === 'HIDDEN' && handleCardClick(i)}
                                        style={{
                                            height: '100px',
                                            cursor: card === 'HIDDEN' && !isShuffling ? 'pointer' : 'default',
                                            userSelect: 'none',
                                            perspective: '1000px',
                                            transition: 'transform 0.3s ease',
                                        }}
                                    >
                                        <div
                                            style={{
                                                position: 'relative',
                                                width: '100%',
                                                height: '100%',
                                                textAlign: 'center',
                                                transformStyle: 'preserve-3d',
                                                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                transition: 'transform 0.6s ease-in-out',
                                            }}
                                        >
                                            {/* Front face */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    backgroundColor: '#6c757d',
                                                    color: '#fff',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: '10px',
                                                    fontSize: '1.5rem',
                                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                    transition: 'background-color 0.3s',
                                                }}
                                            >
                                                {card === 'HIDDEN' ? '🎁' : ''}
                                            </div>

                                            {/* Back face */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    backgroundColor: '#28a745',
                                                    color: '#fff',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: '10px',
                                                    transform: 'rotateY(180deg)',
                                                    padding: '0 10px',
                                                    fontSize: '0.95rem',
                                                    fontWeight: 'bold',
                                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                }}
                                            >
                                                {isFlipped ? flippedCardProject : ''}
                                            </div>
                                        </div>
                                    </div>

                                );
                            })}
                        </FlipMove>
                    </div>

                    {showConfetti && (
                        <Confetti
                            width={containerRef.current?.clientWidth || window.innerWidth}
                            height={containerRef.current?.clientHeight || window.innerHeight}
                            recycle={false}
                            numberOfPieces={150}
                        />
                    )}
                </>
            ) : (
                <div
                    style={{
                        marginTop: '40px',
                        padding: '30px',
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #c3e6cb',
                        borderRadius: '10px',
                        textAlign: 'center',
                        color: '#155724',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                    }}
                >
                    <h2>🎊 All teams have received their projects!</h2>
                    <p style={{ fontSize: '1.1rem', marginTop: '10px' }}>
                        We wish all teams the very best with their project ideas! 🚀
                    </p>
                    <button
                        onClick={handleFinish}
                        style={{
                            marginTop: '25px',
                            padding: '12px 24px',
                            backgroundColor: '#17a2b8',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s ease',
                        }}
                    >
                        View Summary
                    </button>
                </div>

            )}
        </div>
    );
};

export default GamePlay;
