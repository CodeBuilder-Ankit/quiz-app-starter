export async function fetchOpenTrivia(amount = 10, difficulty = '', signal) {
  const url = new URL('https://opentdb.com/api.php')
  url.searchParams.set('amount', amount)
  url.searchParams.set('type', 'multiple')
  if (difficulty) url.searchParams.set('difficulty', difficulty)
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error('Failed to fetch questions')
  const data = await res.json()
  // Normalize to our UI model
  const decode = (s) => {
    const txt = document.createElement('textarea')
    txt.innerHTML = s
    return txt.value
  }
  return data.results.map((q, idx) => {
    const options = [...q.incorrect_answers, q.correct_answer].map(decode)
    // shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[options[i], options[j]] = [options[j], options[i]]
    }
    const correctIndex = options.indexOf(decode(q.correct_answer))
    return {
      id: idx + 1,
      question: decode(q.question),
      options,
      answer: correctIndex,
      difficulty: q.difficulty,
      category: q.category
    }
  })
}
