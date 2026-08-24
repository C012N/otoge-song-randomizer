import { Fragment } from "react/jsx-runtime";
import type { Song } from "./types"

type ShowSelectedSongsProps = {
    selectedSongs: Song[];
}

export function ShowSelectedSongs({
    selectedSongs
}: ShowSelectedSongsProps) {
    const createSongCols = () => {
        return selectedSongs.map((song, i) => (
            <Fragment key={i}>
                <p className="
                text-6xl text-balance font-bold
                [text-shadow:_0_0_10px_purple]
                p-4">
                    {song.title}
                </p>
            </Fragment>
        ))
    }
    return (
        <div className="
        bg-[url('/bg_selectedSong.png')] bg-no-repeat bg-center bg-cover
        w-8xl h-[800px] mx-auto flex flex-col gap-6 items-center justify-top pt-60
        tracking-widest">
            {createSongCols()}
        </div>
    );
}