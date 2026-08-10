// スコア入力コンポーネント
// controlルートでのみ表示される

import { NumberInput } from "./TailwindCssDefaults";

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
            <h2>{label}</h2>

            {scores.map((score, i) => (
                <>
                    <h3>{i + 1}曲目:</h3>
                    <NumberInput
                        key={i}
                        value={score}
                        onChange={e => {
                            const value = e.target.valueAsNumber;
                            const next = structuredClone(scores);
                            next[i] = Number.isNaN(value) ? 0 : value;
                            onChange(next);
                        }}
                    />
                </>
            ))}
        </>
    )
}