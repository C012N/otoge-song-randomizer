// スコア入力コンポーネント
// controlルートでのみ表示される

import { Fragment } from "react/jsx-runtime";
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
                <Fragment key={i}>
                    <NumberInput
                        value={score}
                        onChange={e => {
                            const value = e.target.valueAsNumber;
                            const next = structuredClone(scores);
                            next[i] = Number.isNaN(value) ? 0 : value;
                            onChange(next);
                        }}
                    />
                </Fragment>
            ))}
        </>
    )
}