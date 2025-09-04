import React, { useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Results() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const questions = state?.questions || []
  const answers = state?.answers || []

  const score = useMemo(() => {
    return questions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0)
  }, [answers, questions])

  if (!questions.length) {
    return (
      <div className="card">
        <p>No results to show. Please take the quiz first.</p>
        <Link to="/quiz" className="btn primary">Start Quiz</Link>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>Results</h2>
      <p className="meta">You scored <strong>{score}</strong> / {questions.length}</p>

      <div className="space"></div>

      {questions.map((q, i) => {
        const selected = answers[i]
        const isCorrect = selected === q.answer
        return (
          <div key={q.id} style={{marginBottom:16, paddingBottom:16, borderBottom:'1px dashed rgba(155,176,209,0.2)'}}>
            <div className="meta">Q{i+1} • {q.category} • {q.difficulty}</div>
            <div style={{fontWeight:600}}>{q.question}</div>
            <div className="meta">
              Your answer: <strong style={{color: isCorrect ? 'var(--ok)' : 'var(--bad)'}}>
                {selected != null ? q.options[selected] : '—'}
              </strong>
              { !isCorrect && selected != null ? <span> • Correct: <strong>{q.options[q.answer]}</strong></span> : null }
            </div>
          </div>
        )
      })}

      <div className="actions">
        <button className="btn" onClick={() => navigate('/quiz')}>Restart Quiz</button>
        <Link to="/quiz?source=api&difficulty=easy&timer=30" className="btn primary">Try API Mode →</Link>
      </div>
    </div>
  )
}
