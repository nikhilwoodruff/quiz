"use client";

import { useState, useEffect } from "react";
import { rounds } from "./data";
import Link from "next/link";

function Snowflakes() {
  const [flakes, setFlakes] = useState<
    { id: number; left: number; delay: number; duration: number }[]
  >([]);

  useEffect(() => {
    const newFlakes = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 5 + Math.random() * 10,
    }));
    setFlakes(newFlakes);
  }, []);

  return (
    <>
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`,
          }}
        >
          ❄
        </div>
      ))}
    </>
  );
}

export default function QuizMaster() {
  const [currentRound, setCurrentRound] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [view, setView] = useState<"home" | "quiz">("home");

  const round = rounds[currentRound];
  const question = round?.questions[currentQuestion];
  const totalQuestions = round?.questions.length || 0;

  const nextQuestion = () => {
    setShowAnswer(false);
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentRound < rounds.length - 1) {
      setCurrentRound(currentRound + 1);
      setCurrentQuestion(0);
    }
  };

  const prevQuestion = () => {
    setShowAnswer(false);
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentRound > 0) {
      setCurrentRound(currentRound - 1);
      setCurrentQuestion(rounds[currentRound - 1].questions.length - 1);
    }
  };

  const goToRound = (roundIndex: number) => {
    setCurrentRound(roundIndex);
    setCurrentQuestion(0);
    setShowAnswer(false);
    setView("quiz");
  };

  if (view === "home") {
    return (
      <main className="min-h-screen p-8 relative">
        <Snowflakes />
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-[#ffd700]">
              🎄 Christmas quiz 2024 🎄
            </h1>
            <p className="text-xl text-gray-300">
              Merry Christmas! Select a round to begin.
            </p>
          </div>

          <div className="space-y-4">
            {rounds.map((r, index) => (
              <button
                key={index}
                onClick={() => goToRound(index)}
                className="w-full p-6 rounded-xl text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background:
                    index % 2 === 0
                      ? "linear-gradient(135deg, #c41e3a 0%, #8b0000 100%)"
                      : "linear-gradient(135deg, #1a472a 0%, #0d2818 100%)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm opacity-75">Round {index + 1}</span>
                    <h2 className="text-2xl font-semibold">{r.name}</h2>
                    <p className="text-sm opacity-75 mt-1">
                      {r.questions.length} questions
                      {r.isInteractive && " • Interactive"}
                    </p>
                  </div>
                  <span className="text-3xl">
                    {index === 0 && "🌍"}
                    {index === 1 && "🗺️"}
                    {index === 2 && "📚"}
                    {index === 3 && "🎬"}
                    {index === 4 && "📍"}
                    {index === 5 && "🖼️"}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/player"
              className="inline-block px-6 py-3 rounded-lg bg-[#ffd700] text-[#0c1821] font-semibold hover:bg-[#ffed4a] transition-colors"
            >
              📱 Open player view (play on your phone)
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 relative">
      <Snowflakes />
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setView("home")}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            ← Back to rounds
          </button>
          <div className="text-right">
            <span className="text-sm text-gray-400">Round {currentRound + 1}</span>
            <h2 className="text-xl font-semibold text-[#ffd700]">{round.name}</h2>
          </div>
        </div>

        <div
          className="rounded-2xl p-8 mb-8"
          style={{
            background: "rgba(26, 42, 58, 0.9)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 215, 0, 0.2)",
          }}
        >
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-1 rounded-full bg-[#ffd700] text-[#0c1821] text-sm font-semibold">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
          </div>

          {question?.image && (
            <div className="mb-6 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={question.image}
                alt="Question image"
                className="max-h-64 rounded-xl shadow-lg object-contain"
              />
            </div>
          )}

          <h3 className="text-3xl font-semibold text-center mb-8">
            {question?.question}
          </h3>

          {question?.images && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              {question.images.map((img, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl text-center transition-all ${
                    showAnswer && img.label === question.answer
                      ? "bg-green-600 ring-4 ring-green-400"
                      : "bg-white/10"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.label}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <span className="font-medium">{img.label}</span>
                </div>
              ))}
            </div>
          )}

          {question?.options && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              {question.options.map((option, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl text-center transition-all ${
                    showAnswer && option === question.answer
                      ? "bg-green-600 ring-4 ring-green-400"
                      : "bg-white/10"
                  }`}
                >
                  <span className="font-medium">{String.fromCharCode(65 + i)}.</span>{" "}
                  {option}
                </div>
              ))}
            </div>
          )}

          <div
            className={`text-center transition-all duration-300 ${
              showAnswer ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="inline-block px-6 py-3 rounded-xl bg-green-600 text-xl font-semibold">
              ✓ {question?.answer}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentRound === 0 && currentQuestion === 0}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ← Previous
          </button>

          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="px-8 py-4 rounded-xl font-semibold text-lg transition-all"
            style={{
              background: showAnswer
                ? "linear-gradient(135deg, #1a472a 0%, #0d2818 100%)"
                : "linear-gradient(135deg, #c41e3a 0%, #8b0000 100%)",
            }}
          >
            {showAnswer ? "Hide answer" : "Reveal answer"}
          </button>

          <button
            onClick={nextQuestion}
            disabled={
              currentRound === rounds.length - 1 &&
              currentQuestion === totalQuestions - 1
            }
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Next →
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {rounds.map((_, i) => (
            <button
              key={i}
              onClick={() => goToRound(i)}
              className={`w-10 h-10 rounded-full transition-all ${
                i === currentRound
                  ? "bg-[#ffd700] text-[#0c1821]"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
