import { type Song, type SelectState } from "./types"

type SongSelectorProps = {
    song: Song | null;
    selectState: SelectState;
    onSelect: () => void;
}

export function SongSelector({
    song,
    selectState,
    onSelect
}: SongSelectorProps) {
    // null値も自然に描画
    const displaySong = song ?? {
        title: "???",
        difficulty: "???",
        level: "???"
    };

    // 楽曲の描画を状態ごとに管理
    let displaySongByState;

    if (selectState === "not_started") {
        displaySongByState = (
            <>
                <h3>{displaySong.title}</h3>
                <p>選曲待機中...</p>
            </>
        );
    }
    else if (selectState === "finished") {
        displaySongByState = (
            <>
                <h3>{displaySong.title}</h3>
                <p>全曲選曲済み</p>
            </>
        );
    }
    else {
        displaySongByState = (
            <>
                <h3>{displaySong.title}</h3>
                <p>
                    {displaySong.difficulty} {displaySong.level}
                </p>
            </>
        );
    }

    return (
        <div>
            <h2>課題曲:</h2>

            <button
                onClick={onSelect}
                disabled={selectState === "spinning"}
            >
                選曲！
            </button>

            {displaySongByState}

        </div>
    )
}