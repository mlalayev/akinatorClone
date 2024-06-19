import React, { useState, useEffect } from 'react';
import './App.css'

interface Question {
  question: string;
  answer: string | null;
}

interface Character {
  name: string;
  features: Record<string, string>;
}

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [guessedCharacter, setGuessedCharacter] = useState<string | null>(null);
  const [showGuess, setShowGuess] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch('/questions.json');
      const questionsData = await response.json();
      const shuffledQuestions = questionsData.sort(() => Math.random() - 0.5).map((q: string) => ({ question: q, answer: null }));
      setQuestions(shuffledQuestions);
    };

    const fetchCharacters = async () => {
      const response = await fetch('/characters.json');
      const charactersData = await response.json();
      setCharacters(charactersData);
    };

    fetchQuestions();
    fetchCharacters();
  }, []);

  const handleAnswer = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex].question;
    const updatedAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < 15) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const filteredCharacters = characters.filter((character) =>
        Object.keys(updatedAnswers).every(
          (question) => updatedAnswers[question] === character.features[question]
        )
      );
      setGuessedCharacter(filteredCharacters[0]?.name || 'unknown');
      setShowGuess(true);
    }
  };

  const handlePlayAgain = () => {
    setQuestions((prevQuestions) => prevQuestions.sort(() => Math.random() - 0.5).map((q) => ({ ...q, answer: null })));
    setCurrentQuestionIndex(0);
    setAnswers({});
    setGuessedCharacter(null);
    setShowGuess(false);
  };

  if (showGuess) {
    return (
      <div style={{ textAlign: 'center' }}>
        {guessedCharacter !== 'unknown' ? (
          <div>
            <h2>Is it {guessedCharacter}?</h2>
            <button onClick={() => alert('I guessed correctly! Yaaay!')}>Yes</button>
            <button onClick={handlePlayAgain}>No</button>
          </div>
        ) : (
          <div>
            <h2>Sorry, I couldn't guess the character.</h2>
            <button onClick={handlePlayAgain}>Play Again?</button>
          </div>
        )}
      </div>
    );
  }

  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex].question;

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>{currentQuestion}</h2>
      <button onClick={() => handleAnswer('yes')}>Yes</button>
      <button onClick={() => handleAnswer('no')}>No</button>
      <button onClick={() => handleAnswer('I don\'t know')}>I don't know</button>
    </div>
  );
};

export default App;
