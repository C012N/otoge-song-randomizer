import { Fragment } from "react/jsx-runtime";
import type { Song, Tournament } from "./types"
import url_bg_division from "../assets/images/roulette/bg_division.png";
import url_bg_round from "../assets/images/roulette/bg_round.png";
import url_bg_selectedSong from "../assets/images/roulette/bg_selectedSong.png";

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
    const currentDivisionTitle = tournament.divisions[numCurrentDivision].gameTitle;
    const currentRoundName = tournament
        .divisions[numCurrentDivision]
        .rounds[numCurrentRound].name;

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
                flex flex-col items-center justify-center select-none
                [text-shadow:_0_0_10px_purple] font-serif">

            <div
                className="
                  bg-no-repeat bg-center bg-contain
                  w-[1394px] h-[236px] flex items-center justify-center"
                style={{backgroundImage: `url(${url_bg_division})`}}>
                <p className="
                    font-thin text-8xl">
                    {currentDivisionTitle} 部門
                </p>
            </div>

            <div
                className="
                  bg-no-repeat bg-center bg-contain
                  w-[1188px] h-[161px] flex items-center justify-center"
                style={{backgroundImage: `url(${url_bg_round})`}}>
                <p className="
                    font-thin text-5xl">
                    {currentRoundName}
                </p>
            </div>

            <div
                className="
                  bg-no-repeat bg-center bg-contain
                  w-[1398px] h-[600px] flex flex-col items-center justify-center
                  tracking-widest"
                style={{backgroundImage: `url(${url_bg_selectedSong})`}}>
                <div className="max-w-6xl font-sans text-balance">
                    {createSongCols()}
                </div>
            </div>

        </div>
    );
}