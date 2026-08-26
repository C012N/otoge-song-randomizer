import type { Tournament } from "./types"

type DivisionCardProps = {
    tournament: Tournament
    numCurrentDivision: number
}

export function DivisionCard({
    tournament,
    numCurrentDivision
}: DivisionCardProps) {
    const teamNameA = tournament.teamA.name
    const teamNameB = tournament.teamB.name
    const currentDivision = tournament.divisions[numCurrentDivision]
    const currentDivisionTitle = currentDivision.gameTitle
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
                    <p className="italic font-mono font-bold text-8xl pt-12 pl-30">
                        {teamNameA}
                    </p>
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
                <div className="bg-[url('/images/vs.png')] bg-contain bg-no-repeat w-[300px] h-[300px]"></div>
                <div className="
                    bg-[url('/images/bg_division_card.png')] bg-cover bg-no-repeat
                    w-[750px] h-[750px]
                    [text-shadow:_0_0_4px_blue]">
                    <p className="italic font-mono font-bold text-8xl pt-12 pl-30">
                        {teamNameB}
                    </p>
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