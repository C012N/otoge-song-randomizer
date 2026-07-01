// プレイヤーカードのコンポーネント
// チーム名、プレイヤー名、自選曲、スコアを表示する

type PlayerCardProps = {
    teamName: string;
    playerName: string;
}

export function PlayerCard({
    teamName,
    playerName,
}: PlayerCardProps) {
    return (
        <div className="player-area">
          <h2>{teamName}</h2>

          <p>{playerName}</p>          
        </div>
    )
}