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
                <p className="mt-2 text-3xl font-black tracking-tight md:text-5xl lg:text-6xl">
                    {songForDisplay.title}
                </p>
                <br></br>
                <p className="mt-3 text-2xl font-bold md:text-3xl lg:text-4xl">
                    {songForDisplay.difficulty} {songForDisplay.level}
                </p>
            </div>
        )
    }

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-10 text-center md:py-14 lg:py-16">
            <p className="text-lg font-bold text-gray-400 md:text-xl lg:text-2xl">
                課題曲:
            </p>

            {displaySongByState()}
        </div>
    )
}