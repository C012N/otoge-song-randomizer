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
        const songForDisplay = (song) ? song : {
            title: "???",
            difficulty: "",
            level: ""
        }
        return (
            <div>
                <br/>
                <br/>
                <p className="text-6xl font-bold">
                    {songForDisplay.title}
                </p>
                <br/>
                <p className="text-4xl">
                    {songForDisplay.difficulty} {songForDisplay.level}
                </p>
            </div>
        )
    }

    return (
        <div className="max-w-6xl font-sans text-balance">
            {displaySongByState()}
        </div>
    )
}