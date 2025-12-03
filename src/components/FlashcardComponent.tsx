import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import { Volume as VolumeUp } from 'lucide-react';

interface FlashcardProps {
  card: Flashcard;
  onViewed: () => void;
}

const FlashcardComponent: React.FC<FlashcardProps> = ({ card, onViewed }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Notify parent when card is viewed (only when card changes)
  useEffect(() => {
    onViewed();
  }, [card.id, onViewed]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();
      // 优先选德语 voice
      const germanVoice = voices.find(v => v.lang.startsWith('de'));
      const utterance = new SpeechSynthesisUtterance(text);
      if (germanVoice) {
        utterance.voice = germanVoice;
        utterance.lang = germanVoice.lang;
      } else {
        utterance.lang = 'de-DE';
        // 没有德语 voice，弹窗提示
        alert('未检测到德语发音语音包。请在系统或浏览器设置中安装德语语音包。\n\nPC端：\n- Windows: 设置 > 时间和语言 > 语音识别 > 管理语音 > 添加德语（德国），重启浏览器。\n- Mac: 系统设置 > 辅助功能 > 朗读内容 > 系统语音 > 管理语音 > 添加德语，重启浏览器。\n- Linux: 安装并配置德语TTS（如espeak-ng），或用Chrome最新版。\n- Chrome: chrome://settings/languages 添加德语，重启浏览器。\n\n手机用户：\n- iOS: 设置 > 辅助功能 > 朗读内容 > 声音 > 添加德语。\n- Android: 设置 > 辅助功能 > 文字转语音 > 安装德语语音。');
      }
      synth.speak(utterance);
    }
  };

  return (
    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <h3 className="text-2xl font-bold mb-4">{card.german}</h3>
          {card.example && (
            <p className="text-sm italic text-gray-600 dark:text-gray-300 mb-4">
              {card.example}
            </p>
          )}
          <div className="absolute bottom-4 left-4">
            <button 
              onClick={(e) => { 
                e.stopPropagation();
                speakText(card.german);
              }}
              className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
              aria-label="Pronounce"
            >
              <VolumeUp className="h-5 w-5 text-primary" />
            </button>
          </div>
          <div className="absolute top-4 right-4 text-xs text-gray-500 dark:text-gray-400">
            Click to flip
          </div>
        </div>
        <div className="flashcard-back">
          <h3 className="text-2xl font-bold mb-2">{card.english}</h3>
          <p className="text-lg mb-4">{card.german}</p>
          {card.example && (
            <div className="mt-2">
              <p className="text-sm italic text-gray-600 dark:text-gray-300">
                {card.example}
              </p>
            </div>
          )}
          <div className="absolute top-4 right-4 text-xs text-gray-500 dark:text-gray-400">
            Click to flip back
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardComponent;
