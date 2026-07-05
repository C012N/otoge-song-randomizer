// プレイヤーカードのコンポーネント
// チーム名、プレイヤー名、自選曲、スコアを表示する

import type { SelectState } from "./types";

type PlayerCardProps = {
    selectState: SelectState;
    teamName: string;
    playerName: string;
    scores: number[];
}

export function PlayerCard({
    selectState,
    teamName,
    playerName,
    scores,
}: PlayerCardProps) {
    // 試合結果表示以外
    if (selectState !== "showResult") return (
        <div className="player-area">
            <h2>{teamName}</h2>

            <p>{playerName}</p>
        </div>
    )

    // 試合結果表示
    return (
        <div className="player-area">
            <h2>{teamName}</h2>

            <p>{playerName}</p>

            {scores.map((score, i) => (
                <>
                    <p>{i+1}曲目: {score}</p>
                </>
            ))}
        </div>
    )
}