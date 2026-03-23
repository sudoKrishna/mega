"use client";

import { useState, useEffect, useRef } from "react";

const words = ["apple", "banana", "cherry", "date", "fig", "grape"];

function generateTest(count = 50) {
  return Array.from({ length: count }, () =>
    words[Math.floor(Math.random() * words.length)]
  ).join(" ");
}

export default function TypingTest() {
  const [testText, setTestText] = useState(generateTest());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [time, setTime] = useState(60);
  const [running, setRunning] = useState(false);
  const [typedChars, setTypedChars] = useState<string[]>([]);

  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [caretPos, setCaretPos] = useState({ top: 0, left: 0 });

  const restartTest = () => {
    setTestText(generateTest());
    setCurrentIndex(0);
    setErrors(0);
    setTime(60);
    setRunning(false);
    setTypedChars([]);
    charRefs.current = [];
  };

  useEffect(() => {
    if (running && time > 0) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    } else if (time === 0) {
      setRunning(false);
    }
  }, [running, time]);

  const handleKeyDown = (e: any) => {
    if (e.key === "Escape") {
      restartTest();
      return;
    }

    if (e.key === "Backspace") {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setTypedChars((prev) => prev.slice(0, -1));

        const wasError =
          typedChars[currentIndex - 1] !== testText[currentIndex - 1];
        if (wasError) {
          setErrors((prev) => prev - 1);
        }
      }
      return;
    }

    if (!running) setRunning(true);

    const char = e.key;
    if (char.length > 1) return;

    const expectedChar = testText[currentIndex];

    if (char === expectedChar) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setErrors((prev) => prev + 1);
      setCurrentIndex(currentIndex + 1);
    }

    setTypedChars((prev) => [...prev, char]);
  };

  
  useEffect(() => {
    const el = charRefs.current[currentIndex];
    const container = containerRef.current;

    if (el && container) {
      const rect = el.getBoundingClientRect();
      const parentRect = container.getBoundingClientRect();

      setCaretPos({
        top: rect.top - parentRect.top,
        left: rect.left - parentRect.left,
      });
    }
  }, [currentIndex, testText]);

  const correctChars = typedChars.filter(
    (c, i) => c === testText[i]
  ).length;

  const wpm = Math.round(
    (correctChars / 5) / ((60 - time) / 60) || 0
  );

  const accuracy = Math.round(
    (correctChars / (currentIndex || 1)) * 100
  );

  const lines = testText.match(/.{1,40}(\s|$)/g) || [];
  const currentLine = Math.floor(currentIndex / 40);
  const visibleLines = lines.slice(currentLine, currentLine + 3);

  return (
    <div
      className="relative flex flex-col items-center bg-[#111111] justify-center min-h-screen p-8"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
     
      <div className="absolute top-4 left-6 text-lg text-gray-300 font-semibold">
        WPM: {wpm}
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        Guest Typing Test
      </h1>

      
      <div
        ref={containerRef}
        className="mb-6 text-3xl leading-loose tracking-wide max-w-3xl mx-auto text-center relative"
      >
        {visibleLines.map((line, lineIndex) => (
          <div key={lineIndex}>
            {line.split("").map((char, charIndex) => {
              const globalIndex =
                (currentLine + lineIndex) * 40 + charIndex;

              let color = "text-gray-500";

              if (globalIndex < currentIndex) {
                color =
                  typedChars[globalIndex] === char
                    ? "text-gray-200"
                    : "text-red-500";
              }

              return (
                <span
                  key={charIndex}
                  ref={(el) => {
                    charRefs.current[globalIndex] = el;
                  }}
                  className={color}
                >
                  {char}
                </span>
              );
            })}
          </div>
        ))}

       
        <div
          className="absolute w-[2px] h-7 bg-white transition-all duration-75 ease-linear"
          style={{
            top: caretPos.top,
            left: caretPos.left,
          }}
        />
      </div>

      
      <div className="text-center text-white">
        <p>Time: {time}s</p>
        <p>Accuracy: {accuracy}%</p>
        <p>Errors: {errors}</p>
      </div>

      <p className="mt-6 text-gray-500 text-sm">
        Click anywhere and start typing!
      </p>
      <p className="mt-2 text-gray-500 text-sm">
        esc for restart
      </p>
    </div>
  );
}