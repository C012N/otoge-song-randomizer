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
        </div>
    )
}