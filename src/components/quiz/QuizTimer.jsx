import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export const QuizTimer = ({ totalMinutes, onTimeUp }) => {
  const [secondsLeft, setSecondsLeft] = useState(totalMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft < 120; // under 2 mins

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        borderRadius: '9999px',
        backgroundColor: isUrgent ? 'rgba(239, 68, 68, 0.12)' : 'rgba(14, 165, 233, 0.12)',
        color: isUrgent ? '#dc2626' : '#0284c7',
        border: `1.5px solid ${isUrgent ? 'rgba(239, 68, 68, 0.3)' : 'rgba(14, 165, 233, 0.3)'}`,
        fontWeight: '700',
        fontSize: '0.9rem',
        fontFamily: 'var(--font-mono)'
      }}
    >
      <Clock size={16} />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};
