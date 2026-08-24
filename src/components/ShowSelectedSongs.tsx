import type { Song } from "./types"

type ShowSelectedSongsProps = {
    selectedSongs: Song[];
}

export function ShowSelectedSongs({
    selectedSongs
}: ShowSelectedSongsProps) {
    const createSongCols = () => {
        return selectedSongs.map((song, i) => (
            <div>
                <p>{i + 1}. {song.title}</p>
            </div>
        ))
    }
    return (
        <div className="
        bg-[url('/bg_selectedSong.png')] bg-no-repeat bg-center bg-cover
        w-8xl h-[800px] mx-auto flex flex-col items-center justify-center
        tracking-widest">
            {createSongCols()}
        </div>
    );
}