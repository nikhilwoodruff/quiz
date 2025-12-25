"use client";

import { useState } from "react";
import { rounds } from "../data";
import Link from "next/link";
import WorldMap, { calculateDistance, calculateGeoPoints } from "../components/WorldMap";
import { getImagePath } from "../utils";

const TEAMS = [
  "Nya and Gramps",
  "Alicia, Luca and Mum",
  "Dad and Grandma",
];

// Flatten all questions with round info
const allQuestions = rounds.flatMap((round, roundIndex) =>
  round.questions.map((q, qIndex) => ({
    ...q,
    roundName: round.name,
    roundIndex,
    questionIndex: qIndex,
  }))
);

interface GeoGuess {
  lat: number;
  lng: number;
}

export default function PlayerView() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    new Array(allQuestions.length).fill(null)
  );
  const [geoGuesses, setGeoGuesses] = useState<(GeoGuess | null)[]>(
    new Array(allQuestions.length).fill(null)
  );
  const [geoScores, setGeoScores] = useState<(number | null)[]>(
    new Array(allQuestions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [view, setView] = useState<"team" | "rounds" | "quiz" | "results">("team");
  const [lockedAnswers, setLockedAnswers] = useState<boolean[]>(
    new Array(allQuestions.length).fill(false)
  );

  const question = allQuestions[currentQuestion];
  const totalQuestions = allQuestions.length;
  const isLocked = lockedAnswers[currentQuestion];
  const isGeoQuestion = !!question?.coordinates;

  const selectAnswer = (answer: string) => {
    if (isLocked) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const selectGeoGuess = (lat: number, lng: number) => {
    if (isLocked) return;
    const newGuesses = [...geoGuesses];
    newGuesses[currentQuestion] = { lat, lng };
    setGeoGuesses(newGuesses);
  };

  const lockAnswer = () => {
    if (isGeoQuestion) {
      if (!geoGuesses[currentQuestion]) return;
      const guess = geoGuesses[currentQuestion]!;
      const actual = question.coordinates!;
      const distance = calculateDistance(guess.lat, guess.lng, actual.lat, actual.lng);
      const points = calculateGeoPoints(distance);
      const newGeoScores = [...geoScores];
      newGeoScores[currentQuestion] = points;
      setGeoScores(newGeoScores);
    } else {
      if (!answers[currentQuestion]) return;
    }
    const newLocked = [...lockedAnswers];
    newLocked[currentQuestion] = true;
    setLockedAnswers(newLocked);
  };

  const nextQuestion = () => {
    setCurrentQuestion(Math.min(totalQuestions - 1, currentQuestion + 1));
  };

  // Calculate running score
  const runningScore = allQuestions.reduce((score, q, i) => {
    if (!lockedAnswers[i]) return score;
    if (q.coordinates) {
      return score + (geoScores[i] || 0);
    }
    return answers[i]?.toLowerCase().trim() === q.answer.toLowerCase().trim()
      ? score + 1
      : score;
  }, 0);

  const questionsAnswered = lockedAnswers.filter(Boolean).length;

  // Max possible score (GeoGuessr questions worth 2, others worth 1)
  const maxPossibleScore = allQuestions.reduce((max, q) => {
    return max + (q.coordinates ? 2 : 1);
  }, 0);

  const calculateFinalScore = () => {
    return allQuestions.reduce((score, q, i) => {
      if (q.coordinates) {
        return score + (geoScores[i] || 0);
      }
      return answers[i]?.toLowerCase().trim() === q.answer.toLowerCase().trim()
        ? score + 1
        : score;
    }, 0);
  };

  const calculateRoundScores = () => {
    return rounds.map((round, roundIndex) => {
      const roundQuestions = allQuestions.filter(
        (q) => q.roundIndex === roundIndex
      );
      const startIndex = allQuestions.findIndex(
        (q) => q.roundIndex === roundIndex
      );

      let correct = 0;
      let maxPoints = 0;

      roundQuestions.forEach((q, i) => {
        const globalIndex = startIndex + i;
        if (q.coordinates) {
          correct += geoScores[globalIndex] || 0;
          maxPoints += 2;
        } else {
          if (answers[globalIndex]?.toLowerCase().trim() === q.answer.toLowerCase().trim()) {
            correct += 1;
          }
          maxPoints += 1;
        }
      });

      return { name: round.name, correct, total: maxPoints };
    });
  };

  const goToRound = (roundIndex: number) => {
    const startIndex = allQuestions.findIndex((q) => q.roundIndex === roundIndex);
    setCurrentQuestion(startIndex);
    setView("quiz");
  };

  // Team selection
  if (view === "team") {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold mb-4 text-[#ffd700]">
            🎄 Christmas quiz 🎄
          </h1>
          <p className="text-gray-300 mb-8">Select your team</p>
          <div className="space-y-3 mb-6">
            {TEAMS.map((team) => (
              <button
                key={team}
                onClick={() => setTeamName(team)}
                className={`w-full p-4 rounded-xl font-semibold text-lg transition-all ${
                  teamName === team
                    ? "bg-[#ffd700] text-[#0c1821]"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {team}
              </button>
            ))}
          </div>
          <button
            onClick={() => teamName && setView("rounds")}
            disabled={!teamName}
            className="w-full p-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{
              background: "linear-gradient(135deg, #c41e3a 0%, #8b0000 100%)",
            }}
          >
            Continue
          </button>
          <Link
            href="/"
            className="inline-block mt-6 text-gray-400 hover:text-white transition-colors"
          >
            ← Back to quizmaster view
          </Link>
        </div>
      </main>
    );
  }

  // Round selector
  if (view === "rounds") {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold mb-2 text-[#ffd700]">
            🎄 Christmas quiz 🎄
          </h1>
          <p className="text-xl text-gray-300 mb-6">{teamName}</p>
          <p className="text-gray-400 mb-4">Select a round to start</p>
          <div className="space-y-3 mb-6">
            {rounds.map((round, i) => (
              <button
                key={i}
                onClick={() => goToRound(i)}
                className="w-full p-4 rounded-xl text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background:
                    i % 2 === 0
                      ? "linear-gradient(135deg, #c41e3a 0%, #8b0000 100%)"
                      : "linear-gradient(135deg, #1a472a 0%, #0d2818 100%)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm opacity-75">Round {i + 1}</span>
                    <h2 className="text-lg font-semibold">{round.name}</h2>
                  </div>
                  <span className="text-sm opacity-75">
                    {round.questions.length} questions
                  </span>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setView("team")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Change team
          </button>
        </div>
      </main>
    );
  }

  if (submitted) {
    const score = calculateFinalScore();
    const roundScores = calculateRoundScores();
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold mb-4 text-[#ffd700]">
            🎄 Results 🎄
          </h1>
          <p className="text-2xl mb-2">{teamName}</p>
          <div
            className="text-6xl font-bold mb-6 p-8 rounded-2xl"
            style={{
              background: "rgba(26, 42, 58, 0.9)",
              border: "1px solid rgba(255, 215, 0, 0.2)",
            }}
          >
            {score} / {maxPossibleScore}
          </div>
          <div className="space-y-2 mb-6">
            {roundScores.map((rs, i) => (
              <div
                key={i}
                className="flex justify-between p-3 rounded-lg bg-white/10"
              >
                <span>{rs.name}</span>
                <span className="font-semibold">
                  {rs.correct}/{rs.total}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setAnswers(new Array(totalQuestions).fill(null));
              setGeoGuesses(new Array(totalQuestions).fill(null));
              setGeoScores(new Array(totalQuestions).fill(null));
              setLockedAnswers(new Array(totalQuestions).fill(false));
              setCurrentQuestion(0);
              setView("rounds");
            }}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            Back to rounds
          </button>
        </div>
      </main>
    );
  }

  // For non-geo questions
  const isCorrect =
    !isGeoQuestion &&
    answers[currentQuestion]?.toLowerCase().trim() ===
    question.answer.toLowerCase().trim();

  // For geo questions
  const geoDistance = isGeoQuestion && isLocked && geoGuesses[currentQuestion] && question.coordinates
    ? calculateDistance(
        geoGuesses[currentQuestion]!.lat,
        geoGuesses[currentQuestion]!.lng,
        question.coordinates.lat,
        question.coordinates.lng
      )
    : null;

  const currentGeoScore = geoScores[currentQuestion];

  const hasAnswer = isGeoQuestion
    ? !!geoGuesses[currentQuestion]
    : !!answers[currentQuestion];

  return (
    <main className="min-h-screen p-4 flex flex-col">
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => setView("rounds")}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Rounds
          </button>
          <span className="text-sm text-gray-400">{teamName}</span>
        </div>
        <div className="text-center">
          <p className="text-sm text-[#ffd700] font-medium">{question.roundName}</p>
          <div className="flex justify-center items-center gap-4 mt-1">
            <span className="inline-block px-4 py-1 rounded-full bg-[#ffd700] text-[#0c1821] text-sm font-semibold">
              {currentQuestion + 1} / {totalQuestions}
            </span>
            <span className="inline-block px-4 py-1 rounded-full bg-green-600 text-sm font-semibold">
              Score: {runningScore}
            </span>
          </div>
        </div>
      </div>

      <div
        className="flex-1 rounded-2xl p-4 flex flex-col overflow-auto"
        style={{
          background: "rgba(26, 42, 58, 0.9)",
          border: "1px solid rgba(255, 215, 0, 0.2)",
        }}
      >
        {question?.image && (
          <div className="flex items-center justify-center mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImagePath(question.image)}
              alt="Question"
              className="max-h-32 rounded-xl shadow-lg object-contain"
            />
          </div>
        )}

        <h3 className="text-lg font-semibold text-center mb-3">
          {question?.question}
        </h3>

        {/* GeoGuessr map */}
        {isGeoQuestion && (
          <div className="mb-3">
            <WorldMap
              onSelect={selectGeoGuess}
              selectedPoint={geoGuesses[currentQuestion]}
              actualPoint={question.coordinates}
              showActual={isLocked}
              disabled={isLocked}
            />
            {isLocked && geoDistance !== null && (
              <div
                className={`mt-3 p-4 rounded-xl text-center ${
                  currentGeoScore === 2
                    ? "bg-green-600/30"
                    : currentGeoScore === 1
                    ? "bg-yellow-600/30"
                    : "bg-red-600/30"
                }`}
              >
                <p className="text-lg font-semibold">
                  {currentGeoScore === 2 && "🎯 Excellent! 2 points"}
                  {currentGeoScore === 1 && "👍 Close! 1 point"}
                  {currentGeoScore === 0 && "❌ Too far! 0 points"}
                </p>
                <p className="text-sm mt-1">
                  {Math.round(geoDistance).toLocaleString()} km away
                </p>
                <p className="text-sm mt-1 opacity-75">
                  {question.answer}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Multiple choice options */}
        {question?.options && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {question.options.map((option, i) => {
              const isSelected = answers[currentQuestion] === option;
              const isAnswer = question.answer.startsWith(option);
              let bgClass = "bg-white/10";
              if (isLocked) {
                if (isAnswer) bgClass = "bg-green-600 ring-2 ring-green-400";
                else if (isSelected) bgClass = "bg-red-600 ring-2 ring-red-400";
              } else if (isSelected) {
                bgClass = "bg-[#ffd700] ring-2 ring-[#ffd700]";
              }
              return (
                <button
                  key={i}
                  onClick={() => selectAnswer(option)}
                  disabled={isLocked}
                  className={`p-3 rounded-xl text-center transition-all ${bgClass} ${isLocked ? "cursor-default" : ""}`}
                >
                  <span
                    className={`font-medium ${
                      isSelected && !isLocked ? "text-[#0c1821]" : ""
                    }`}
                  >
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Text input for regular questions */}
        {!question?.options && !isGeoQuestion && (
          <>
            <input
              type="text"
              value={answers[currentQuestion] || ""}
              onChange={(e) => selectAnswer(e.target.value)}
              placeholder="Type your answer..."
              disabled={isLocked}
              className={`w-full p-4 rounded-xl border text-white placeholder-gray-400 text-center ${
                isLocked
                  ? isCorrect
                    ? "bg-green-600/30 border-green-500"
                    : "bg-red-600/30 border-red-500"
                  : "bg-white/10 border-white/20"
              }`}
            />
            {isLocked && (
              <div
                className={`mt-3 p-4 rounded-xl text-center ${
                  isCorrect ? "bg-green-600/30" : "bg-red-600/30"
                }`}
              >
                <p className="text-lg font-semibold">
                  {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
                </p>
                {!isCorrect && (
                  <p className="text-sm mt-1">
                    Answer: <span className="font-medium">{question.answer}</span>
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* Feedback for multiple choice */}
        {question?.options && isLocked && (
          <div
            className={`mt-3 p-4 rounded-xl text-center ${
              question.answer.startsWith(answers[currentQuestion] || "")
                ? "bg-green-600/30"
                : "bg-red-600/30"
            }`}
          >
            <p className="text-lg font-semibold">
              {question.answer.startsWith(answers[currentQuestion] || "")
                ? "✓ Correct!"
                : "✗ Incorrect"}
            </p>
            <p className="text-sm mt-1">
              {question.answer}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-4">
        {!isLocked ? (
          <button
            onClick={lockAnswer}
            disabled={!hasAnswer}
            className="flex-1 p-4 rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #c41e3a 0%, #8b0000 100%)",
            }}
          >
            Lock answer
          </button>
        ) : currentQuestion === totalQuestions - 1 ? (
          <button
            onClick={() => setSubmitted(true)}
            className="flex-1 p-4 rounded-xl font-semibold transition-all"
            style={{
              background: "linear-gradient(135deg, #1a472a 0%, #0d2818 100%)",
            }}
          >
            See final results
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="flex-1 p-4 rounded-xl font-semibold transition-all"
            style={{
              background: "linear-gradient(135deg, #1a472a 0%, #0d2818 100%)",
            }}
          >
            Next question →
          </button>
        )}
      </div>
    </main>
  );
}
