import type { Song, Tournament } from "./types"
import url_roundCard from "../assets/images/cards/roundCard.png";
import url_card_identifier from "../assets/images/cards/card_identifier.png";
import url_logo_teamA from "../assets/images/cards/logo_teamA.png";
import url_logo_teamB from "../assets/images/cards/logo_teamB.png";
import url_vs from "../assets/images/cards/vs.png"

type RoundCardProps = {
    tournament: Tournament
    numCurrentDivision: number
    numCurrentRound: number
    isSongOpened: boolean
}

export function RoundCard({
    tournament,
    numCurrentDivision,
    numCurrentRound,
    isSongOpened
}: RoundCardProps) {
    const currentDivision = tournament.divisions[numCurrentDivision];
    const currentRound = currentDivision.rounds[numCurrentRound];
    const teamNameA = tournament.teamA.name;
    const teamNameB = tournament.teamB.name;

    function displaySong (song: Song) {
        return isSongOpened ? song : {
            title: "???",
            difficulty: "???",
            level: "???"
        }
    }

    function displayPlayer (teamName: string) {
        const url_logo = teamName === teamNameA
            ? url_logo_teamA
            : url_logo_teamB;

        const teamColor = teamName === teamNameA
            ? "[text-shadow:_0_0_10px_red]"
            : "[text-shadow:_0_0_10px_blue]";

        const player = teamName === teamNameA
            ? currentRound.playerA
            : currentRound.playerB;

        const song = player.song;

        return (
            <div
                className={`
                    bg-contain bg-no-repeat    
                    w-[700px] aspect-[1/1]
                    ${teamColor}`}
                style={{ backgroundImage: `url(${url_roundCard})` }}>

                <div className="pt-11 pl-6 pr-8">
                    <div className="flex items-center pl-7">
                        <img
                            className="w-[140px] block"
                            src={url_logo}
                        />

                            <div className="w-full text-6xl font-bold italic">
                                {teamName}
                            </div>
                        </div>
                        <div className="
                            h-[205px] flex items-center justify-center
                            text-7xl text-balance font-semibold
                            pt-5">
                            {player.name}
                        </div>
                        <div className="
                            h-[190px] flex items-center justify-center
                            text-4xl
                            pt-20">
                            {displaySong(song).title} [{displaySong(song).difficulty} {displaySong(song).level}]
                        </div>
                    </div>
                </div>
        )
    }

    return (
        <div className="pt-12">
            {/* ヘッダ2つ */}
            <div
                className="
                    bg-contain bg-center bg-no-repeat
                    w-6xl aspect-[7/1]
                    mx-auto flex items-center justify-center
                    font-bold text-5xl
                "
                style={{ backgroundImage: `url(${url_card_identifier})` }}>
                {tournament.name} {currentDivision.gameTitle}部門
            </div>

            <div
                className="
                    bg-contain bg-center bg-no-repeat
                    w-2xl aspect-[7/1]
                    mx-auto flex items-center justify-center
                    font-bold text-4xl
                "
                style={{ backgroundImage: `url(${url_card_identifier})` }}>
                {currentRound.name}
            </div>

            {/* [playerA] vs [playerB] */}
            <div className="flex items-center justify-center">
                {/* [playerA] */}
                {displayPlayer(teamNameA)}

                {/* vs */}
                <img
                    className="w-[200px]"
                    src={url_vs}
                />

                {/* [playerB] */}
                {displayPlayer(teamNameB)}
            </div>
        </div>
    )
}