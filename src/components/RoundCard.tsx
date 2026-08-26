import type { Tournament } from "./types"

type RoundCardProps = {
    tournament: Tournament
    numCurrentDivision: number
    numCurrentRound: number
}

export function RoundCard({
    tournament,
    numCurrentDivision,
    numCurrentRound
}: RoundCardProps) {
    const tournamentName = tournament.name
    const teamNameA = tournament.teamA.name
    const teamNameB = tournament.teamB.name
    const divisionTitle = tournament.divisions[numCurrentDivision].gameTitle
    const currentRound = tournament.divisions[numCurrentDivision].rounds[numCurrentRound]
    const roundName = currentRound.name
    const namePlayerA = currentRound.playerA.name
    const namePlayerB = currentRound.playerB.name
    const songPlayerA = currentRound.playerA.song
    const songPlayerB = currentRound.playerB.song

    return (
        <div className="pt-12">
            <div className="
                bg-[url('/images/bg_cardname.png')] bg-contain bg-no-repeat
                w-5xl aspect-[6/1] mx-auto flex items-center justify-center">
                <p className="font-bold text-5xl text-center text-balance">
                    {tournament.name} {divisionTitle}部門
                </p>
            </div>

            <div className="
                bg-[url('/images/bg_cardname.png')] bg-contain bg-no-repeat
                w-xl aspect-[6/1] mx-auto flex items-center justify-center">
                <p className="font-bold text-5xl text-center text-balance">
                    {roundName}
                </p>
            </div>

            <div className="flex items-center justify-center pt-8">
                <div className="
                    bg-[url('/images/bg_round_card.png')] bg-contain bg-no-repeat
                    w-[750px] h-[750px]
                    [text-shadow:_0_0_4px_red]">
                    <p className="italic font-mono font-bold text-8xl pt-12 pl-30">
                        {teamNameA}
                    </p>
                    <div className="
                      flex flex-col gap-[45px] pt-[38px] pl-23
                      font-bold text-5xl">
                    </div>
                </div>
                <div className="bg-[url('/images/vs.png')] bg-contain bg-no-repeat w-[300px] h-[300px]"></div>
                <div className="
                    bg-[url('/images/bg_round_card.png')] bg-contain bg-no-repeat
                    w-[750px] h-[750px]
                    [text-shadow:_0_0_4px_blue]">
                    <p className="italic font-mono font-bold text-8xl pt-12 pl-30">
                        {teamNameB}
                    </p>
                    <div className="
                      flex flex-col gap-[45px] pt-[38px] pl-23
                      font-bold text-5xl">
                    </div>
                </div>
            </div>
        </div>
    )
}