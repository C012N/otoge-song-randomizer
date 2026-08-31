// 選曲パネルのコンポーネント
// 選曲中の楽曲情報を表示する

import { type Song, type Tournament } from "./types"
import url_bg_division from "../assets/images/roulette/bg_division.png";
import url_bg_round from "../assets/images/roulette/bg_round.png";
import url_bg_selectedSong from "../assets/images/roulette/bg_selectedSong.png";

type SongSelectorProps = {
    tournament: Tournament
    numCurrentDivision: number
    numCurrentRound: number
    song: Song | null
}

export function SongSelector({
    tournament,
    numCurrentDivision,
    numCurrentRound,
    song
}: SongSelectorProps) {
    function displaySongByState() {
        const songForDisplay = (song) ? song : {
            title: "???",
            difficulty: "",
            level: ""
        }
        return (
            <div>
                <p className="text-6xl font-bold">
                    {songForDisplay.title}
                </p>
                <br />
                <p className="text-4xl">
                    {songForDisplay.difficulty} {songForDisplay.level}
                </p>
            </div>
        )
    }
    
    const currentDivisionTitle = tournament.divisions[numCurrentDivision].gameTitle
    const currentRoundName = tournament.divisions[numCurrentDivision]
    .rounds[numCurrentRound].name
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
                    {displaySongByState()}
                </div>
            </div>

        </div>
    )
}