import type { DivisionState, RoundState, Tournament, TournamentState } from "./types"
import url_card_identifier from "../assets/images/cards/card_identifier.png";
import url_card_teamA from "../assets/images/cards/divisionCard_teamA.png";
import url_card_teamB from "../assets/images/cards/divisionCard_teamB.png";
import url_logo_teamA from "../assets/images/cards/logo_teamA.png";
import url_logo_teamB from "../assets/images/cards/logo_teamB.png";
import url_vs from "../assets/images/cards/vs.png"

type DivisionCardProps = {
    tournament: Tournament
    tournamentState: TournamentState
    numCurrentDivision: number
}

export function DivisionCard({
    tournament,
    tournamentState,
    numCurrentDivision
}: DivisionCardProps) {
    const teamNameA = tournament.teamA.name
    const teamNameB = tournament.teamB.name
    const currentDivision = tournament.divisions[numCurrentDivision]
    const currentDivisionTitle = currentDivision.gameTitle
    const currentDivisionState = tournamentState.divisionStates[numCurrentDivision]

    const calcTotalScore = (scores: number[]) => scores.reduce((acc, score) => acc + score, 0)

    const roundPoint = (roundState: RoundState, teamName: string) => {
        const totalScoreA = calcTotalScore(roundState.scoresPlayerA)
        const totalScoreB = calcTotalScore(roundState.scoresPlayerB)
        return teamName === tournament.teamA.name
            ? (totalScoreA > totalScoreB ? 1 : 0)
            : (totalScoreB > totalScoreA ? 1 : 0)
    }

    const divisionPoint = (divisionState: DivisionState, teamName: string) =>
        divisionState.roundStates.reduce((acc, roundState) => acc + roundPoint(roundState, teamName), 0)

    function displayTeam(teamName: string) {
        const memberNames = teamName === teamNameA
            ? currentDivision.rounds.map(round => round.playerA.name)
            : currentDivision.rounds.map(round => round.playerB.name);

        return (
            <div className="
                flex flex-col gap-3
                text-4xl
                pl-25
            ">
                {memberNames.map((memberName, i) => {
                    return (
                        <div
                            key={i}
                            className="
                                w-full h-[77px] bg-contain bg-no-repeat
                                flex items-center justify-center"
                        >
                            {memberName}
                        </div>
                    )
                })}
            </div>
        );
    }

    function displayTeamPoints(teamName: string) {
        const roundPoints = currentDivisionState.roundStates.map(roundState => roundPoint(roundState, teamName));
        return (
            <div className="flex flex-col gap-9.5 items-center justify-center text-4xl">
                <p className="h-[75px] text-6xl font-bold">
                    {divisionPoint(currentDivisionState, teamName)}
                </p>

                <div className="flex flex-col gap-6.5">
                    {roundPoints.map((roundPoint, i) => (
                        <div
                            key={i}
                            className="h-[60px] flex items-center"
                        >
                            {roundPoint}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="pt-12">

            {/* ヘッダ */}
            <div
                className="
                  bg-contain bg-center bg-no-repeat
                  w-6xl aspect-[7/1]
                  mx-auto flex items-center justify-center
                  font-bold text-5xl"
                style={{backgroundImage: `url(${url_card_identifier})`}}
            >
                {tournament.name} {currentDivisionTitle}部門
            </div>

            {/* [teamA] vs [teamB] */}
            <div className="flex items-center justify-center">

                {/* [teamA] */}
                <div
                    className="
                        bg-contain bg-no-repeat
                        w-[800px] aspect-[1/1]
                        flex
                        [text-shadow:_0_0_10px_red]
                        py-18"
                    style={{backgroundImage: `url(${url_card_teamA})`}}
                >
                    <div className="w-[666px] pl-6 pr-4">
                        <div className="w-full h-[120px] flex items-center pl-6">
                            <img
                                className="w-[100px] h-[100px] block"
                                src={url_logo_teamA}/>
                            <div className="w-full text-6xl font-bold italic">
                                {teamNameA}
                            </div>
                        </div>

                        <div className="pt-3">
                            {displayTeam(teamNameA)}
                        </div>
                    </div>

                    <div className="w-[134px] pl-5 pr-7 pt-9">
                        {displayTeamPoints(teamNameA)}
                    </div>
                </div>

                {/* vs */}
                <img
                    className="w-[200px]"
                    src={url_vs}
                />

                {/* [teamB] */}
                <div
                    className="
                        bg-contain bg-no-repeat
                        w-[800px] aspect-[1/1]
                        flex
                        [text-shadow:_0_0_10px_blue]
                        py-18"
                    style={{backgroundImage: `url(${url_card_teamB})`}}
                >
                    <div className="w-[128px] pl-6 pr-5 pt-9">
                        {displayTeamPoints(teamNameB)}
                    </div>

                    <div className="w-[666px] pl-4 pr-6">
                        <div className="w-full h-[120px] flex items-center pl-6">
                            <img
                                className="w-[100px] h-[100px] block"
                                src={url_logo_teamB}/>
                            <div className="w-full text-6xl font-bold italic">
                                {teamNameB}
                            </div>
                        </div>

                        <div className="pt-3">
                            {displayTeam(teamNameB)}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}