import React, { useState, useEffect } from 'react';

const sampleWords = ['apple', 'brick', 'crane', 'delta', 'eagle', 'flint', 'grape']; // 7 words

export default function Game() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [input, setInput] = useState('');
  const [revealCount, setRevealCount] = useState(1);
  const [guesses, setGuesses] = useState([]); // { word, correct, tries }
  const [tries, setTries] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState([]);

  const handleGuess = () => {
    if (currentIndex >= sampleWords.length - 1) return; // stop at 6th word (index 5)

    const correctWord = sampleWords[currentIndex];
    const isCorrect = input.toLowerCase() === correctWord;
    const updatedGuesses = [...guesses];
    const score = isCorrect ? Math.max(0, 30 - tries * 10) : 0;

    updatedGuesses[currentIndex] = {
      word: correctWord,
      correct: isCorrect,
      tries: tries,
    };

    const updatedScores = [...scores];

    if (isCorrect) {
      updatedScores[currentIndex] = score;
      setCurrentIndex(currentIndex + 1);
      setRevealCount(1);
      setInput('');
      setTries(0);
    } else {
      if (revealCount + 1 >= correctWord.length) {
        // Reveal full word and move on
        updatedScores[currentIndex] = 0;
        setCurrentIndex(currentIndex + 1);
        setRevealCount(1);
        setInput('');
        setTries(0);
      } else {
        // Reveal one more letter and reset input
        setRevealCount(revealCount + 1);
        setTries(tries + 1);
        setInput('');
      }
    }

    setGuesses(updatedGuesses);
    setScores(updatedScores);

    // End game after 6th word is done
    if (currentIndex === sampleWords.length - 2) {
      setTimeout(() => setGameOver(true), 500); // delay to allow last word to show
    }
  };

  const getDisplayWord = (index) => {
    const guessed = guesses[index];

    if (index === 0 || index === sampleWords.length - 1) return sampleWords[index];
    if (guessed?.correct) return guessed.word;
    if (index < currentIndex) return guessed?.word || '_'.repeat(sampleWords[index].length);
    return '_'.repeat(sampleWords[index].length);
  };

  const displayInput = (correctWord, typedInput, revealCount) => {
    return correctWord.split('').map((char, i) => {
      if (i < revealCount) return char;
      if (typedInput[i]) return typedInput[i];
      return '_';
    }).join('');
  };

  const getScoreDisplay = (index) => {
    if (index <= 0 || index >= sampleWords.length - 1) return '';
    const score = scores[index];
    return score != null ? `+${score}` : '';
  };

  const totalScore = scores.reduce((sum, s) => sum + (s || 0), 0);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Word Game</h2>
      <ol>
        {sampleWords.map((word, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ width: '3rem', fontWeight: 'bold' }}>{getScoreDisplay(i)}</div>
            {i === currentIndex && currentIndex < sampleWords.length - 1 ? (
              <input
                type="text"
                value={displayInput(word, input, revealCount)}
                onChange={(e) => {
                  const raw = e.target.value.toLowerCase().replace(/[^a-z]/g, '');
                  setInput(raw.slice(0, word.length));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGuess();
                }}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '1.5rem',
                  letterSpacing: '0.3rem',
                  width: `calc(${word.length}ch + ${word.length * 0.3}rem)`,
                  border: 'none',
                  background: 'none',
                  outline: 'none',
                  padding: 0,
                  margin: 0,
                  textAlign: 'left',
                  caretColor: 'black',
                }}
                autoFocus
              />
            ) : (
              <span style={{ 
                fontFamily: 'monospace', 
                fontSize: '1.5rem',
                letterSpacing: '0.1rem', 
                }}>
                {getDisplayWord(i)}
              </span>
            )}
          </li>
        ))}
      </ol>

      {gameOver && (
        <div style={{
          position: 'fixed',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff',
          border: '2px solid black',
          padding: '2rem',
          zIndex: 10,
          textAlign: 'center'
        }}>
          <h3>Game Over!</h3>
          <p>Your Total Score: <strong>{totalScore}</strong></p>
          <button onClick={() => window.location.reload()}>Play Again</button>
        </div>
      )}
    </div>
  );
}
