type ScoreInputProps = {
    label: string;
    scores: number[];
    onChange: (score: number[]) => void;
}

export function ScoreInput({
    label,
    scores,
    onChange,
}: ScoreInputProps) {
    return (
        <>
            <h3>{label}</h3>

            {scores.map((score, i) => (
                <input
                    key={i}
                    type="number"
                    value={score}
                    onChange={e => {
                        const value = e.target.valueAsNumber;
                        const next = structuredClone(scores);
                        next[i] = Number.isNaN(value) ? 0 : value;
                        onChange(next);
                    }}
                />
            ))}
        </>
    )
}