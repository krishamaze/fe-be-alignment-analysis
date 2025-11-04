export default function Questionnaire({
  questions = [],
  responses = {},
  onChange,
}) {
  const handle = (id, value) => onChange({ ...responses, [id]: value });
  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <div key={q.id}>
          <label className="label mb-1 block">{q.text}</label>
          {q.type === 'choice' ? (
            <div className="flex gap-4">
              {q.options.map((opt) => (
                <label key={opt} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    checked={responses[q.id] === opt}
                    onChange={() => handle(q.id, opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ) : (
            <input
              className="input"
              value={responses[q.id] || ''}
              onChange={(e) => handle(q.id, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
