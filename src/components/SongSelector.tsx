// 選曲パネルのコンポーネント
// 選曲中の楽曲情報を表示する

import { type Song } from "./types"

type SongSelectorProps = {
    song: Song
}

export function SongSelector({
    song: song
}: SongSelectorProps) {
    // 選曲状態に応じて楽曲を表示
    function displaySongByState() {
        if (!song) {
            return (
                <div>
                    <h3>???</h3>
                    <p>選曲待機中...</p>
                </div>
            )
        }
        else {
            return (
                <div>
                    <h3>{song.title}</h3>
                    <p>{song.difficulty} {song.level}</p>
                </div>
            )
        }
    }

    return (
        <div>
            <h2>課題曲:</h2>

            {displaySongByState()}
        </div>
    )
}