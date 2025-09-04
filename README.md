 🎯 Quiz App — Project Specification

🚀 Objective

Build a **Quiz App in React** to demonstrate **front-end fundamentals, state management, and user-friendly UI/UX** while tracking score and showing results.

 ✅ Requirements

 🖌️ Design & UI/UX

* Design a clean, responsive layout for desktop and mobile.
* Show one question at a time with four multiple-choice options.
* Highlight navigation actions clearly: Next, Previous/Skip (if implemented), Submit/Finish.
* Display score and quiz progress at all times.
* Use a modern, readable font (Inter, Roboto, or system default).

🧩 Core Features

📖 Quiz Page

* Load 5–10 multiple-choice questions (via Open Trivia DB API or local JSON).
* Render one question at a time with exactly 4 options.
* Require users to select an answer before proceeding.

 🏆 Score Tracking

* Track correct and incorrect selections.
* Calculate final score at the end (e.g., *“You scored 7/10”*).

 📊 Results Page

* Show summary of all questions with:

  * User’s answer vs correct answer.
  * Marked correct/incorrect.
* Provide a Restart Quiz option.

---

 ⚙️ Technical Requirements

* Use: React functional components with hooks (`useState`, `useEffect`).
* Pass data via props into presentational components.
* Style using CSS (responsive, mobile-first).
* Manage state transitions (Question → Answer → Next → Results).
* Bonus: Implement React Router with routes like `/quiz` and `/results`.



 🔄 State Flow

1. Load questions (API or JSON) → Initialize quiz state.
2. Capture answer selection → Lock in → Move to next question.
3. Compute total score → Navigate to Results → Reset for Restart.

---

 📂 Data Source

* Option A (API Fetch questions from [Open Trivia DB](https://opentdb.com/) with loading & error handling.
* Option B (Local):Use `questions.json` with fields: `id`, `question`, `options`, `correctAnswer`.

---

 🧪 Testing & Validation

* Handle edge cases: no internet, empty/short data, timeouts, or rapid clicks.
* Prevent navigation without an answer (unless Skip is allowed).
* Ensure mobile responsiveness and accessibility.



 ✨ Bonus Features

* Add a timer per question (auto-submit when time runs out).
* Show progress (Question X of Y or progress bar).
* Offer difficulty levels (easy/medium/hard).
* Store high scores in localStorage.
* Enhance UX with animations (fade-in, button feedback).
* Support accessibility (keyboard navigation, ARIA labels, focus states).

🎉 Thank you for reviewing this project!

