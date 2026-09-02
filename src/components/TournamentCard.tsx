import url_tournamentCard from "../assets/images/cards/tournamentCard.png";
import url_card_identifier from "../assets/images/cards/card_identifier.png";
import url_logo_teamA from "../assets/images/cards/logo_teamA.png";
import url_logo_teamB from "../assets/images/cards/logo_teamB.png";
import type { Tournament, TournamentState } from "./types";

type TournamentCardProps = {
    tournament: Tournament;
    tournamentState: TournamentState;
}

export function TournamentCard({
    tournament,
    tournamentState,

}: TournamentCardProps) {
    const teamNameA = tournament.teamA.name;
    const teamNameB = tournament.teamB.name;

    const teamScoresCol = (tournamentState: TournamentState, teamName: string) => {
        const teamColor = (teamName: string) =>
            teamName === teamNameA
                ? "[text-shadow:_0_0_10px_red]"
                : "[text-shadow:_0_0_10px_blue]"
        const divisionScores: (teamName: string) => number[] = (teamName) => {
            return teamName === teamNameA
                ? tournamentState.divisionStates
                    .map(divisionState => {
                        switch (divisionState.judge) {
                            case "teamA":
                                return 1
                            case "even":
                                return 1
                            default:
                                return 0
                        }
                    })
                : tournamentState.divisionStates
                    .map(divisionState => {
                        switch (divisionState.judge) {
                            case "teamB":
                                return 1
                            case "even":
                                return 1
                            default:
                                return 0
                        }
                    })
        }

        const totalScore = (teamName: string) =>
            divisionScores(teamName).reduce((acc, score) => acc + score, 0);

        return (
            <div className={`
                w-[100px] h-full
                flex flex-col  gap-19
                ${teamColor(teamName)} text-5xl pt-24`}>

                <div className="text-6xl font-bold">
                    {totalScore(teamName)}
                </div>

                <div className="flex flex-col gap-14">
                    {divisionScores(teamName).map((score, i) => (
                        <div key={i}>
                            {score}
                        </div>
                    ))}
                </div>

            </div>
        )
    }

    const centerCol = () =>  {
        const divisionTitles = tournament.divisions
            .map(division => division.gameTitle);

        return (
            <div className="
                w-[780px] h-full flex flex-col gap-11 items-between
                [text-shadow:_0_0_10px_purple] text-6xl py-15">
                <div className="flex justify-between px-6">
                    <img
                        className="w-[120px]"
                        src={url_logo_teamA}
                    />
                    <img
                        className="w-[120px]"
                        src={url_logo_teamB}
                    />
                </div>
                {divisionTitles.map((title, i) => (
                    <div key={i}>
                        {title}部門
                    </div>
                ))}
            </div>
        )
    }
    return (
        <div className="
                bg-contain bg-no-repeat
                flex flex-col items-center justify-center pt-12"
        >
            <div
                className="
                    w-4xl aspect-[8/1]
                    bg-contain bg-no-repeat bg-center
                    flex items-center justify-center
                    text-5xl font-bold"
                style={{ backgroundImage: `url(${url_card_identifier})` }}
            >
                {tournament.name}
            </div>

            <div
                className="
                    w-[1200px] aspect-[4/3]
                    bg-contain bg-no-repeat
                    flex items-center justify-center gap-15.5"
                style={{ backgroundImage: `url(${url_tournamentCard})` }}
            >
                {teamScoresCol(tournamentState, teamNameA)}

                {centerCol()}
                
                {teamScoresCol(tournamentState, teamNameB)}
            </div>
        </div>
    )
}