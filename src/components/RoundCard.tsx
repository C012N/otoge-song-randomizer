import type { Song, Tournament } from "./types"

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
    const division = tournament.divisions[numCurrentDivision]
    const round = division.rounds[numCurrentRound]

    const displaySong = (song: Song) => isSongOpened ? song : {
        title: "???",
        difficulty: "???",
        level: "???"
    }

    return (
        <div className="pt-12">
            <div className="
                bg-[url('/images/bg_cardname.png')] bg-contain bg-no-repeat
                w-5xl aspect-[6/1] mx-auto flex items-center justify-center">
                <p className="font-bold text-5xl text-center text-balance">
                    {tournament.name} {division.gameTitle}部門
                </p>
            </div>

            <div className="
                bg-[url('/images/bg_cardname.png')] bg-contain bg-no-repeat
                w-xl aspect-[6/1] mx-auto flex items-center justify-center">
                <p className="font-bold text-5xl text-center text-balance">
                    {round.name}
                </p>
            </div>

            <div className="flex items-center justify-center">
                <div className="
                    bg-[url('/images/bg_round_card.png')] bg-contain bg-no-repeat
                    w-[700px] h-[700px]
                    [text-shadow:_0_0_4px_red]">
                        <div className="flex items-center pl-[62px] pt-[54px]">
                            <div className="
                                  bg-[url('/images/logo_teamA.png')] bg-contain bg-no-repeat
                                  w-[130px] aspect-[1/1]"></div>
                            <p className="italic font-mono font-bold text-7xl pl-30">
                                {tournament.teamA.name}
                            </p>
                        </div>
                    <div className="flex flex-col gap-[160px] pt-[100px]">
                        <p className="font-bold text-6xl">
                            {round.playerA.name}
                        </p>
                        <p className="text-4xl">
                            {displaySong(round.playerA.song).title} [{displaySong(round.playerA.song).difficulty}]
                        </p>
                    </div>
                </div>
                <div className="bg-[url('/images/vs.png')] bg-contain bg-no-repeat w-[300px] h-[300px]"></div>
                <div className="
                    bg-[url('/images/bg_round_card.png')] bg-contain bg-no-repeat
                    w-[700px] h-[700px]
                    [text-shadow:_0_0_4px_blue]">
                    <div className="flex items-center pl-[62px] pt-[54px]">
                            <div className="
                                  bg-[url('/images/logo_teamB.png')] bg-contain bg-no-repeat
                                  w-[130px] aspect-[1/1]"></div>
                            <p className="italic font-mono font-bold text-7xl pl-16">
                                {tournament.teamB.name}
                            </p>
                        </div>
                    <div className="flex flex-col gap-[160px] pt-[100px]">
                        <p className="font-bold text-6xl">
                            {round.playerB.name}
                        </p>
                        <p className="text-4xl">
                            {displaySong(round.playerB.song).title} [{displaySong(round.playerB.song).difficulty}]
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}