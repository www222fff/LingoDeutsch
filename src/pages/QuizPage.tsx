import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizzes } from '../data/quizzes';
import { ArrowLeft, Trophy } from 'lucide-react';
import QuizQuestion from '../components/QuizQuestion';
import confetti from 'canvas-confetti';

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(quizzes.find(q => q.id === id));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  
  useEffect(() => {
    const foundQuiz = quizzes.find(q => q.id === id);
    setQuiz(foundQuiz);
    
    // Reset state when quiz changes
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsQuizComplete(false);
  }, [id]);
  
  useEffect(() => {
    if (isQuizComplete) {
      // Trigger confetti for high scores
      if (quiz && score / quiz.questions.length >= 0.7) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  }, [isQuizComplete, quiz, score]);
  
  if (!quiz) {
    return (
      <div className="min-h-screen py-12 px-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <button 
            onClick={() => navigate('/quizzes')}
            className="btn-primary"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  
  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsQuizComplete(true);
    }
  };
  
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsQuizComplete(false);
  };

  const categoryColors = {
    basics: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    grammar: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    vocabulary: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    phrases: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  };
  
  const levelColors = {
    beginner: 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-200',
    intermediate: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
    advanced: 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200'
  };
  
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/quizzes')}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary 
                    dark:hover:text-accent mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Quizzes
        </button>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColors[quiz.category]}`}>
                {quiz.category.charAt(0).toUpperCase() + quiz.category.slice(1)}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${levelColors[quiz.level]}`}>
                {quiz.level.charAt(0).toUpperCase() + quiz.level.slice(1)}
              </span>
            </div>
            
            <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
            
            {!isQuizComplete && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </span>
                <span className="text-sm font-medium">
                  Score: {score}/{currentQuestionIndex}
                </span>
              </div>
            )}
          </div>
          
          {!isQuizComplete ? (
            <QuizQuestion 
              question={currentQuestion}
              onAnswer={handleAnswer}
              onNext={handleNext}
              isLastQuestion={currentQuestionIndex === quiz.questions.length - 1}
            />
          ) : (
            <div className="text-center py-8">
              <div className="inline-block p-4 rounded-full bg-accent/20 mb-4">
                <Trophy className="h-12 w-12 text-accent" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
              <p className="text-lg mb-6">
                Your Score: {score} out of {quiz.questions.length} 
                ({Math.round((score / quiz.questions.length) * 100)}%)
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={restartQuiz}
                  className="btn-primary"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => navigate('/quizzes')}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                            font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 
                            transition-colors duration-300"
                >
                  Back to Quizzes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;