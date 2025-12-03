import React, { useState } from 'react';
import { QuizQuestion as QuizQuestionType } from '../types';
import { Volume as VolumeUp, CheckCircle, XCircle } from 'lucide-react';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
  isLastQuestion: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ 
  question, 
  onAnswer, 
  onNext,
  isLastQuestion 
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleOptionSelect = (option: string) => {
    if (!isSubmitted) {
      setSelectedOption(option);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSubmitted) {
      setUserAnswer(e.target.value);
    }
  };

  const checkAnswer = () => {
    let correct = false;

    if (question.type === 'multiple-choice') {
      correct = selectedOption === question.correctAnswer;
    } else if (question.type === 'fill-in-blank') {
      correct = userAnswer.trim().toLowerCase() === String(question.correctAnswer).toLowerCase();
    } else if (question.type === 'matching') {
      correct = true;
    }

    setIsCorrect(correct);
    setIsSubmitted(true);
    onAnswer(correct);
  };

  const handleNext = () => {
    onNext();
    setSelectedOption('');
    setUserAnswer('');
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();
      const germanVoice = voices.find(v => v.lang.startsWith('de'));
      const utterance = new SpeechSynthesisUtterance(text);
      if (germanVoice) {
        utterance.voice = germanVoice;
        utterance.lang = germanVoice.lang;
      } else {
        utterance.lang = 'de-DE';
        alert('未检测到德语发音语音包。请在系统或浏览器设置中安装德语语音包。\n\nPC端：\n- Windows: 设置 > 时间和语言 > 语音识别 > 管理语音 > 添加德语（德国），重启浏览器。\n- Mac: 系统设置 > 辅助功能 > 朗读内容 > 系统语音 > 管理语音 > 添加德语，重启浏览器。\n- Linux: 安装并配置德语TTS（如espeak-ng），或用Chrome最新版。\n- Chrome: chrome://settings/languages 添加德语，重启浏览器。\n\n手机用户：\n- iOS: 设置 > 辅助功能 > 朗读内容 > 声音 > 添加德语。\n- Android: 设置 > 辅助功能 > 文字转语音 > 安装德语语音。');
      }
      synth.speak(utterance);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{question.question}</h3>
        {question.type !== 'matching' && (
          <button
            onClick={() => speakText(question.question)}
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
            aria-label="Listen to question"
          >
            <VolumeUp className="h-5 w-5 text-primary dark:text-accent" />
          </button>
        )}
      </div>

      {question.type === 'multiple-choice' && (
        <div className="space-y-3">
          {question.options?.map((option, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                isSubmitted 
                  ? option === question.correctAnswer
                    ? 'border-success bg-success/10'
                    : selectedOption === option
                      ? 'border-error bg-error/10'
                      : 'border-gray-200 dark:border-gray-700'
                  : selectedOption === option
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5'
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              <div className="flex justify-between items-center">
                <span>{option}</span>
                {isSubmitted && option === question.correctAnswer && (
                  <CheckCircle className="h-5 w-5 text-success" />
                )}
                {isSubmitted && selectedOption === option && option !== question.correctAnswer && (
                  <XCircle className="h-5 w-5 text-error" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {question.type === 'fill-in-blank' && (
        <div className="mb-4">
          <input
            type="text"
            className={`w-full p-3 border rounded-lg ${
              isSubmitted
                ? isCorrect
                  ? 'border-success bg-success/10'
                  : 'border-error bg-error/10'
                : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary'
            }`}
            placeholder="Type your answer here"
            value={userAnswer}
            onChange={handleInputChange}
            disabled={isSubmitted}
          />
          {isSubmitted && (
            <div className="mt-2 text-sm">
              {isCorrect ? (
                <span className="text-success flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" /> Correct!
                </span>
              ) : (
                <span className="text-error flex items-center">
                  <XCircle className="h-4 w-4 mr-1" /> 
                  Incorrect. The correct answer is: {String(question.correctAnswer)}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {question.type === 'matching' && (
        <div className="space-y-3">
          {question.options?.map((option, index) => (
            <div key={index} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              {option}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        {!isSubmitted ? (
          <button
            className="btn-primary w-full"
            onClick={checkAnswer}
            disabled={
              (question.type === 'multiple-choice' && !selectedOption) ||
              (question.type === 'fill-in-blank' && !userAnswer)
            }
          >
            Submit Answer
          </button>
        ) : (
          <button
            className="btn-primary w-full"
            onClick={handleNext}
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          </button>
        )}
      </div>

      {isSubmitted && (
        <div className="mt-4">
          {isCorrect ? (
            <div className="p-3 bg-success/10 text-success rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Correct! Great job!</span>
            </div>
          ) : (
            <div className="p-3 bg-error/10 text-error rounded-lg flex items-center">
              <XCircle className="h-5 w-5 mr-2" />
              <span>
                {question.type === 'multiple-choice' 
                  ? `Incorrect. The correct answer is: ${question.correctAnswer}`
                  : 'Incorrect. Try again next time!'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;