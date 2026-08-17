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

    const showPlayerResult = (player: Player, scores: number[], winner: boolean) => {
        const totalScore = scores.reduce((acc, score) => acc + score, 0);
        return (
            <div className={`w-full rounded-3xl border-3 ${winner ? 'border-green-500' : 'border-gray-600'} bg-slate-900/80 grid grid-cols-3 items-center text-white text-center mt-6 p-4`}>
                <div className="font-bold text-4xl">
                    {player.name}
                </div>
                <div className="font-bold text-6xl">
                    {formatScore(totalScore)}
                </div>
                <div className="text-2xl">
                    ①{formatScore(scores[0])} <br />
                    ②{formatScore(scores[1])} <br />
                    ③{formatScore(scores[2])}
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto px-4 py-4 text-center md:px-10 md:py-6">
            <h1 className="[text-shadow:_2px_2px_0_rgb(64_64_64),_-2px_2px_0_rgb(64_64_64),_2px_-2px_0_rgb(64_64_64),_-2px_-2px_0_rgb(64_64_64)]">
                {divisionName}部門 {roundName}
            </h1>
            <p className="py-2 text-xl text-white text-left">
                ① {playerA.song.title} / ② {playerB.song.title} / ③ {roundState.selectedSong.title}
            </p>

            {showPlayerResult(playerA, scoresPlayerA, totalScoreA >= totalScoreB)}

            {showPlayerResult(playerB, scoresPlayerB, totalScoreB >= totalScoreA)}
        </div>
    )
}