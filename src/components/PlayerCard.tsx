// プレイヤーカードのコンポーネント
// チーム名、プレイヤー名、自選曲、スコアを表示する

import {type Song} from "./types"

type PlayerCardProps = {
    teamName: string;
    playerName: string;
    selectedSong: Song | null;
    scores: number[];
}

export function PlayerCard({
    teamName,
    playerName,
    selectedSong,
    scores,
}: PlayerCardProps) {
    return (
        <div className="player-area">
          <h2>{teamName}</h2>

          <p>{playerName}</p>

          <p>自選曲:</p>

          <p>{selectedSong?.title}</p>

          <p>{selectedSong?.difficulty}</p>

          <p>Lv. {selectedSong?.level}</p>

          <p>1曲目: {scores[0]}</p>

          <p>2曲目: {scores[1]}</p>

          <p>3曲目: {scores[2]}</p>
        </div>
    )
}