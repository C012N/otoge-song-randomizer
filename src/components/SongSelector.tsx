// 選曲パネルのコンポーネント
// 選曲中の楽曲情報を表示する

import { type Song, type Tournament } from "./types"

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
                <br />
                <br />
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
                w-full h-screen
                bg-[url('/images/bg_roulette.png')] bg-no-repeat bg-center bg-cover
                flex flex-col items-center justify-center select-none
                [text-shadow:_0_0_10px_purple] font-serif">

            <div className="
                  bg-[url('/images/bg_division.png')] bg-no-repeat bg-center bg-contain
                  w-[1394px] h-[236px] flex items-center justify-center">
                <p className="
                    font-thin text-8xl">
                    {currentDivisionTitle} 部門
                </p>
            </div>

            <div className="
                  bg-[url('images/bg_round.png')] bg-no-repeat bg-center bg-contain
                  w-[1188px] h-[161px] flex items-center justify-center">
                <p className="
                    font-thin text-5xl">
                    {currentRoundName}
                </p>
            </div>

            <div className="
                  bg-[url('images/bg_selectedSong.png')] bg-no-repeat bg-center bg-contain
                  w-[1398px] h-[600px] flex flex-col items-center justify-center
                  tracking-widest">
                <div className="max-w-6xl font-sans text-balance">
                    {displaySongByState()}
                </div>
            </div>

        </div>
    )
}