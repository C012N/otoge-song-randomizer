import { Fragment } from "react/jsx-runtime";
import type { Song, Tournament } from "./types"

type ShowSelectedSongsProps = {
    tournament: Tournament
    numCurrentDivision: number
    numCurrentRound: number
    selectedSongs: Song[]
}

export function ShowSelectedSongs({
    tournament,
    numCurrentDivision,
    numCurrentRound,
    selectedSongs
}: ShowSelectedSongsProps) {
    const division = tournament.divisions[numCurrentDivision]
    const round = division.rounds[numCurrentRound]

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
                w-full h-screen
                bg-[url('/images/bg_roulette.png')] bg-no-repeat bg-center bg-cover
                flex flex-col items-center justify-center select-none
                [text-shadow:_0_0_10px_purple] font-serif">

            <div className="
                  bg-[url('/images/bg_division.png')] bg-no-repeat bg-center bg-contain
                  w-[1394px] h-[236px] flex items-center justify-center">
                <p className="
                    font-thin text-8xl">
                    {division.gameTitle} 部門
                </p>
            </div>

            <div className="
                  bg-[url('images/bg_round.png')] bg-no-repeat bg-center bg-contain
                  w-[1188px] h-[161px] flex items-center justify-center">
                <p className="
                    font-thin text-5xl">
                    {round.name}
                </p>
            </div>

            <div className="
                  bg-[url('images/bg_selectedSong.png')] bg-no-repeat bg-center bg-contain
                  w-[1398px] h-[600px] flex flex-col items-center justify-center
                  tracking-widest">
                <div className="max-w-6xl font-sans text-balance pt-16">
                    {createSongCols()}
                </div>
            </div>

        </div>
    );
}