// App.js
import React, { useState, useEffect } from "react";
import questions from "./questions";
import Confetti from "react-confetti";
import './App.css';

const App = () => {
  const [difficulty, setDifficulty] = useState("Easy");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [leaderboard, setLeaderboard] = useState([]);

  const quiz = questions[difficulty];
  const question = quiz[currentQuestion];

  useEffect(() => {
    if (timeLeft <= 0) {
      handleAnswer("time");
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, currentQuestion]);

  const handleAnswer = (selected) => {
    const isCorrect = selected === question.answer;
    if (isCorrect) {
      setScore(score + 1);
    }

    const next = currentQuestion + 1;
    if (next < quiz.length) {
      setCurrentQuestion(next);
      setTimeLeft(15);
    } else {
      setShowResult(true);
      const newEntry = { name: `Player`, score };
      setLeaderboard((prev) => [...prev, newEntry].sort((a, b) => b.score - a.score));
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setTimeLeft(15);
  };

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <h1>Quiz App</h1>
      <button onClick={() => setDarkMode(!darkMode)}>Toggle {darkMode ? "Light" : "Dark"} Mode</button>

      {!showResult && (
        <div className="quiz-box">
          <div className="difficulty-toggle">
            {Object.keys(questions).map((lvl) => (
              <button key={lvl} className={difficulty === lvl ? "active" : ""} onClick={() => setDifficulty(lvl)}>
                {lvl}
              </button>
            ))}
          </div>

          <div className="timer">Time Left: {timeLeft}s</div>
          <div className="question">{question.question}</div>
          <div className="options">
            {question.options.map((opt) => (
              <button key={opt} onClick={() => handleAnswer(opt)}>{opt}</button>
            ))}
          </div>

          <div className="score">Score: {score}</div>
        </div>
      )}

      {showResult && (
        <div className="result">
          <h2>Quiz Completed!</h2>
          <p>Your Score: {score} / {quiz.length}</p>
          <button onClick={restartQuiz}>Play Again</button>
          <h3>Leaderboard</h3>
          <ul>
            {leaderboard.map((entry, idx) => (
              <li key={idx}>{entry.name}: {entry.score}</li>
            ))}
          </ul>
          {score === quiz.length && <Confetti />}
        </div>
      )}
    </div>
  );
};

export default App;
