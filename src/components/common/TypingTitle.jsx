import React, { useState, useEffect } from 'react';

/**
 * TypingTitle - Keeps "VLSI" static and types/cycles through rotating VLSI-related phrases
 * e.g., "Simplified", "Made Easy", "Demystified", "Design & Verification", "Mastery"
 */
export const TypingTitle = ({
  staticPrefix = 'VLSI ',
  words = ['Simplified', 'Made Easy', 'Demystified', 'Design & Verification', 'Mastery'],
  className = '',
  style = {},
  prefixStyle = {},
  wordStyle = {}
}) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex % words.length];
    let timer;

    if (!isDeleting && displayedText.length < currentWord.length) {
      // Typing phase: ~110ms per character
      timer = setTimeout(() => {
        setDisplayedText(currentWord.slice(0, displayedText.length + 1));
      }, 110);
    } else if (!isDeleting && displayedText.length === currentWord.length) {
      // Pause at full word
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 1400);
    } else if (isDeleting && displayedText.length > 0) {
      // Deleting phase: ~50ms per character
      timer = setTimeout(() => {
        setDisplayedText(currentWord.slice(0, displayedText.length - 1));
      }, 50);
    } else if (isDeleting && displayedText.length === 0) {
      // Move to next word after brief pause
      timer = setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }, 400);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, wordIndex, words]);

  return (
    <span
      className={`typing-title-wrapper ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', ...style }}
    >
      {staticPrefix && (
        <span style={{ color: '#ffffff', marginRight: '6px', ...prefixStyle }}>
          {staticPrefix}
        </span>
      )}
      <span style={{ color: '#38bdf8', ...wordStyle }}>
        {displayedText}
      </span>
      <span className="blinking-cursor" aria-hidden="true">|</span>
      <style>{`
        .blinking-cursor {
          display: inline-block;
          margin-left: 3px;
          color: #38bdf8;
          font-weight: 300;
          animation: blink 0.9s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
};
