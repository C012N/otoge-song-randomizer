// 試合結果を表形式で表示するコンポーネント
import type { Player, RoundState } from "./types";

interface ShowRoundResultProps {
    divisionName: string;
    roundName: string;
    roundState: RoundState;
    teamNameA: string;
    teamNameB: string;
    imageMap: Map<string, string>;
    playerA: Player;
    playerB: Player;
    scoresPlayerA: number[];
    scoresPlayerB: number[];
}

export function ShowRoundResult({
    divisionName,
    roundName,
    roundState,
    teamNameA,
    teamNameB,
    playerA,
    playerB,
    scoresPlayerA,
    scoresPlayerB,
}: ShowRoundResultProps) {
    const totalScoreA = scoresPlayerA.reduce((acc, score) => acc + score, 0);
    const totalScoreB = scoresPlayerB.reduce((acc, score) => acc + score, 0);

    if (!roundState.selectedSong) {
        return (
            <div className="text-white font-sans p-10">
                <h1>課題曲を選択してください</h1>
            </div>
        );
    }
    
    const formatScore = (score: number) => score.toLocaleString();

    const showPlayerResult = (teamName: string, player: Player, scores: number[], winner: boolean) => {
        const teamColor = (teamName === teamNameA) ? 'red-500' : 'blue-500';
        const totalScore = scores.reduce((acc, score) => acc + score, 0);
        return (
            <div className={`
                w-full rounded-3xl border-3
                ${winner ? 'border-green-500' : 'border-gray-600'}
                bg-slate-900/70 flex items-center justify-around
                text-white text-center py-6`}>
                
                <div className="flex gap-4 items-center font-bold">
                    <p className={`rounded-full bg-${teamColor} text-black text-2xl px-3 py-1`}>
                        {teamName}
                    </p>
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
                    ③{formatScore(scores[2])}
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto
        flex flex-col gap-12">
            <p className="
            text-6xl font-serif pt-15
            [text-shadow:_0_0_10px_purple,_2px_2px_2px_black]
            [text-shadow:]">
                {divisionName}部門 {roundName}
            </p>
            <div className="
            [text-shadow:_0_0_4px_purple]
            text-3xl text-white
            flex flex-col items-center">
                <div className="text-left">
                    <p>① {playerA.song.title}</p>
                    <p>② {playerB.song.title}</p>
                    <p>③ {roundState.selectedSong.title}</p>
                </div>
                
            </div>

            {showPlayerResult(teamNameA, playerA, scoresPlayerA, totalScoreA >= totalScoreB)}

            {showPlayerResult(teamNameB, playerB, scoresPlayerB, totalScoreB >= totalScoreA)}
        </div>
    )
}