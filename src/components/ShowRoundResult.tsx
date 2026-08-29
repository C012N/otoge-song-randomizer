// 試合結果を表形式で表示するコンポーネント
import type { Player, RoundState, Tournament } from "./types";

interface ShowRoundResultProps {
    tournament: Tournament
    numCurrentDivision: number
    numCurrentRound: number
    currentRoundState: RoundState
}

export function ShowRoundResult({
    tournament,
    numCurrentDivision,
    numCurrentRound,
    currentRoundState
}: ShowRoundResultProps) {
    const teamNameA = tournament.teamA.name
    const teamNameB = tournament.teamB.name
    const divisionName = tournament.divisions[numCurrentDivision].gameTitle
    const round = tournament.divisions[numCurrentDivision].rounds[numCurrentRound]
    const roundName = round.name
    const roundjudge = round.judge;
    const playerA = round.playerA;
    const playerB = round.playerB;
    const scoresPlayerA = currentRoundState.scoresPlayerA
    const scoresPlayerB = currentRoundState.scoresPlayerB
    const totalScoreA = scoresPlayerA.reduce((acc, score) => acc + score, 0);
    const totalScoreB = scoresPlayerB.reduce((acc, score) => acc + score, 0);
    
    const formatScore = (score: number) => score.toLocaleString();

    const calcPoint = (scoresA: number[], scoresB: number[]) => {
        let pointA = 0;
        let pointB = 0;

        for (let i = 0; i < scoresA.length; i++) {
            if (scoresA[i] >= scoresB[i]) pointA += 1;
            if (scoresB[i] >= scoresA[i]) pointB += 1;
        }

        return {pointA, pointB};
    }

    const judge = (player: Player) => {
        switch (roundjudge) {
            case "合計点制": 
                return (player === playerA)
                ? (totalScoreA >= totalScoreB)
                : (totalScoreB >= totalScoreA);
            case "勝ち点制": 
                const {pointA, pointB} = calcPoint(scoresPlayerA, scoresPlayerB);
                return (player === playerA)
                ? (pointA >= pointB)
                : (pointB >= pointA);
            default:
                return false;
        }
    }

    const showPlayerResult = (teamName: string, player: Player, scores: number[], winner: boolean) => {
        const teamLogo = (teamName === teamNameA) ? "bg-[url('/images/logo_teamA.png')]" : "bg-[url('/images/logo_teamB.png')]";
        const teamColor = (teamName === teamNameA) ? "[text-shadow:_0_0_4px_red]" : "[text-shadow:_0_0_4px_blue]";
        const totalScore = scores.reduce((acc, score) => acc + score, 0);
        return (
            <div className={`
                w-full rounded-3xl border-3
                ${winner ? 'border-pink-500' : 'border-gray-600'}
                bg-black/80 grid grid-cols-3 items-center justify-items-start
                text-white text-center ${teamColor} pl-12 py-6`}>
                
                <div className="flex gap-4 items-center font-bold">
                    <div className={`${teamLogo} bg-contain bg-no-repeat w-[100px] aspect-[1/1]`}></div>
                    <p className="text-4xl">
                        {player.name}
                    </p>
                </div>

                <p className="font-bold text-6xl">
                    {formatScore(totalScore)}
                </p>
                <p className="text-2xl">
                    ①{formatScore(scores[0])} <br />
                    ②{formatScore(scores[1])} <br />
                    {(currentRoundState.selectedSong)
                    ? `③${formatScore(scores[2])}`
                    : ('')}
                </p>
            </div>
        );
    }

    return (
        <div className="w-7xl h-screen mx-auto
        flex flex-col gap-12">
            <p className="
            text-6xl font-serif pt-15
            [text-shadow:_0_0_10px_purple,_2px_2px_2px_black]
            [text-shadow:]">
                {divisionName}部門 {roundName}
            </p>
            <div className="
            [text-shadow:_0_0_8px_purple]
            text-3xl text-white font-semibold
            flex flex-col items-center">
                <div className="text-left">
                    <p>① {playerA.song.title}</p>
                    <p>② {playerB.song.title}</p>
                    {(currentRoundState.selectedSong)
                    ? (<p>③ {currentRoundState.selectedSong.title}</p>)
                : (<br/>)}
                </div>
                
            </div>

            {showPlayerResult(teamNameA, playerA, scoresPlayerA, judge(playerA))}

            {showPlayerResult(teamNameB, playerB, scoresPlayerB, judge(playerB))}
        </div>
    )
}
