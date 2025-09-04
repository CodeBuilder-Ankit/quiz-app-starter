import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import data from '../data/questions.json'
import { fetchOpenTrivia } from '../utils'

function useCountdown(seconds, deps=[]) {
  const [timeLeft, setTimeLeft] = useState(seconds)
  useEffect(() => { setTimeLeft(seconds) }, deps) // reset when deps change
  useEffect(() => {
    if (timeLeft <= 0) return
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [timeLeft])
  return [timeLeft, setTimeLeft]
}

export default function Quiz() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const useApi = params.get('source') === 'api'
  const difficulty = params.get('difficulty') || ''
  const questionTimer = Number(params.get('timer') || 30)

  const [questions, setQuestions] = useState([])
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([]) // array of selected indices
  const [locked, setLocked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const controllerRef = useRef(null)

  const total = questions.length
  const progress = total ? Math.round(((idx) / total) * 100) : 0

  const [timeLeft, setTimeLeft] = useCountdown(questionTimer, [idx, total])

  useEffect(() => {
    async function load() {
      setLoading(true); setError('')
      try {
        if (controllerRef.current) controllerRef.current.abort()
        controllerRef.current = new AbortController()
        const signal = controllerRef.current.signal
        let qs = []
        if (useApi) {
          qs = await fetchOpenTrivia(10, difficulty, signal)
        } else {
          // local
          qs = data
        }
        setQuestions(qs.slice(0, 10))
        setIdx(0); setAnswers([]); setSelected(null); setLocked(false)
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message || 'Failed to load questions')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => controllerRef.current?.abort()
  }, [useApi, difficulty])

  useEffect(() => {
    if (!locked && timeLeft === 0 && total > 0) {
      // auto-lock selection (even if none)
      handleLock()
    }
  }, [timeLeft, locked, total])

  const current = questions[idx]

  function handleSelect(i) {
    if (locked) return
    setSelected(i)
  }

  function handleLock() {
    if (locked) return
    setLocked(true)
    setAnswers(prev => {
      const copy = [...prev]
      copy[idx] = selected
      return copy
    })
  }

  function handleNext() {
    if (idx < total - 1) {
      setIdx(i => i + 1)
      setSelected(answers[idx + 1] ?? null)
      setLocked(false)
      setTimeLeft(questionTimer)
    } else {
      navigate('/results', { state: { questions, answers } })
    }
  }

  function handlePrev() {
    if (idx > 0) {
      setIdx(i => i - 1)
      setSelected(answers[idx - 1] ?? null)
      setLocked(true) // keep previous locked
    }
  }

  function handleRestart() {
    // reload the same route to reset
    navigate(0)
  }

  const score = useMemo(() => {
    return questions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0)
  }, [answers, questions])

  if (loading) return <div className="card">Loading questions…</div>
  if (error) return <div className="card">Error: {error}</div>
  if (!current) return <div className="card">No questions available.</div>

  const showFeedback = locked

  return (
    <div className="card" aria-live="polite">
      <div className="row" style={{justifyContent:'space-between', alignItems:'center'}}>
        <div className="meta">Category: <strong>{current.category}</strong> • Difficulty: <strong>{current.difficulty}</strong></div>
        <div className="meta">Score: <strong>{score}</strong> / {total}</div>
      </div>

      <div className="space"></div>
      <div className="progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div style={{ width: `${progress}%` }}></div>
      </div>
      <div className="space"></div>
      <div className="meta">Question {idx + 1} of {total} {questionTimer ? <>• Time left: <span aria-live="assertive"><strong>{timeLeft}s</strong></span></> : null}</div>
      <h2>{current.question}</h2>

      <div className="option-grid" role="listbox" aria-label="Options">
        {current.options.map((opt, i) => {
          const isSelected = selected === i
          const isCorrect = showFeedback && i === current.answer
          const isIncorrect = showFeedback && isSelected && i !== current.answer
          const cls = [
            'option',
            isSelected ? 'selected' : '',
            isCorrect ? 'correct' : '',
            isIncorrect ? 'incorrect' : ''
          ].join(' ').trim()
          return (
            <button
              key={i}
              role="option"
              aria-selected={isSelected}
              className={cls}
              onClick={() => handleSelect(i)}
            >
              <span style={{fontWeight:600, marginRight:8}}>{String.fromCharCode(65+i)}.</span> {opt}
            </button>
          )
        })}
      </div>

      <div className="actions">
        <div className="row">
          <button className="btn ghost" onClick={handlePrev} disabled={idx===0}>← Previous <span className="kbd">Alt+←</span></button>
          <button className="btn" onClick={handleRestart}>Restart</button>
        </div>
        <div className="row">
          {!locked ? (
            <button className="btn primary" onClick={handleLock} disabled={selected==null}>
              {idx === total - 1 ? 'Lock & Finish' : 'Lock Answer'}
            </button>
          ) : (
            <button className="btn primary" onClick={handleNext}>
              {idx === total - 1 ? 'See Results →' : 'Next →'}
            </button>
          )}
        </div>
      </div>

      <div className="space"></div>
      {/* <p className="meta">
        Tip: Add <code>?source=api&amp;difficulty=easy&amp;timer=30</code> to the URL to fetch from Open Trivia DB with a per-question timer.
      </p> */}
    </div>
  )
}
