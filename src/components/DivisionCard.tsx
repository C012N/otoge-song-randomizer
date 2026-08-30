import type { DivisionState, RoundState, Tournament, TournamentState } from "./types"

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

    const calcRoundPoint = (roundState: RoundState, teamName: string) => {
        const totalScoreA = calcTotalScore(roundState.scoresPlayerA)
        const totalScoreB = calcTotalScore(roundState.scoresPlayerB)
        return teamName === tournament.teamA.name
            ? (totalScoreA > totalScoreB ? 1 : 0)
            : (totalScoreB > totalScoreA ? 1 : 0)
    }
    
    const calcDivisionPoint = (divisionState: DivisionState, teamName: string) =>
        divisionState.roundStates.reduce((acc, roundState) => acc + calcRoundPoint(roundState, teamName), 0)

    return (
        <div className="pt-12">
            <div className="
                  bg-[url('/images/bg_cardname.png')] bg-contain bg-no-repeat
                  w-5xl aspect-[6/1] mx-auto flex items-center justify-center">
                <p className="font-bold text-5xl text-center text-balance">
                    {tournament.name} {currentDivisionTitle}部門
                </p>
            </div>
            <div className="flex items-center justify-center pt-8">
                <div className="
                    bg-[url('/images/bg_division_card.png')] bg-contain bg-no-repeat
                    w-[750px] h-[750px]
                    [text-shadow:_0_0_4px_red]">
                    <div className="flex pl-[60px] pt-[45px] items-center">
                        <div className="
                          bg-[url('/images/logo_teamA.png')] bg-contain bg-no-repeat
                          w-[120px] aspect-[1/1]"></div>
                        <p className="flex italic font-mono font-bold text-8xl pl-30">
                            {teamNameA}
                        </p>
                    </div>
                    <div className="
                      flex flex-col gap-[45px] pt-[38px] pl-23
                      font-bold text-5xl">
                        <p>{currentDivision.rounds[0].playerA.name}</p>
                        <p>{currentDivision.rounds[1].playerA.name}</p>
                        <p>{currentDivision.rounds[2].playerA.name}</p>
                        <p>{currentDivision.rounds[3].playerA.name}</p>
                        <p>{currentDivision.rounds[4].playerA.name}</p>
                    </div>
                </div>
                <div className="
                    bg-black/80
                    w-[100px] h-[680px]
                    flex flex-col items-center pt-10 gap-12
                    font-bold text-4xl">
                    <p className="text-6xl">
                        {calcDivisionPoint(currentDivisionState, teamNameA)}
                    </p>
                    <p>{calcRoundPoint(currentDivisionState.roundStates[0], teamNameA)}</p>
                    <p>{calcRoundPoint(currentDivisionState.roundStates[1], teamNameA)}</p>
                    <p>{calcRoundPoint(currentDivisionState.roundStates[2], teamNameA)}</p>
                    <p>{calcRoundPoint(currentDivisionState.roundStates[3], teamNameA)}</p>
                    <p>{calcRoundPoint(currentDivisionState.roundStates[4], teamNameA)}</p>
                </div>
                <div className="bg-[url('/images/vs.png')] bg-contain bg-no-repeat w-[200px] h-[200px]"></div>
                <div className="
                    bg-black/80
                    w-[100px] h-[680px]
                    flex flex-col items-center pt-10 gap-12
                    font-bold text-4xl">
                    <p className="text-6xl">
                        {calcDivisionPoint(currentDivisionState, teamNameB)}
                    </p>
                    <p>{calcRoundPoint(currentDivisionState.roundStates[0], teamNameB)}</p>
                    <p>{calcRoundPoint(currentDivisionState.roundStates[1], teamNameB)}</p>
                    <p>{calcRoundPoint(currentDivisionState.roundStates[2], teamNameB)}</p>
                    <p>{calcRoundPoint(currentDivisionState.roundStates[3], teamNameB)}</p>
                    <p>{calcRoundPoint(currentDivisionState.roundStates[4], teamNameB)}</p>
                </div>
                <div className="
                    bg-[url('/images/bg_division_card.png')] bg-cover bg-no-repeat
                    w-[750px] h-[750px]
                    [text-shadow:_0_0_4px_blue]">
                    <div className="flex pl-[60px] pt-[45px] items-center">
                        <div className="
                          bg-[url('/images/logo_teamB.png')] bg-contain bg-no-repeat
                          w-[120px] aspect-[1/1]"></div>
                        <p className="italic font-mono font-bold text-8xl pl-14">
                            {teamNameB}
                        </p>
                    </div>
                    <div className="
                      flex flex-col gap-[45px] pt-[38px] pl-23
                      font-bold text-5xl">
                        <p>{currentDivision.rounds[0].playerB.name}</p>
                        <p>{currentDivision.rounds[1].playerB.name}</p>
                        <p>{currentDivision.rounds[2].playerB.name}</p>
                        <p>{currentDivision.rounds[3].playerB.name}</p>
                        <p>{currentDivision.rounds[4].playerB.name}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}