// 試合結果を表形式で表示するコンポーネント
import type { Player, RoundState } from "./types";

interface ShowRoundResultProps {
    divisionName: string;
    roundName: string;
    roundState: RoundState;
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
            <div className="w-screen h-screen bg-[#0f172a] text-white flex flex-col justify-center items-center select-none font-sans p-10">
                <h1 className="text-3xl font-black tracking-wider">
                    {divisionName} - {roundName}
                </h1>
                <p className="mt-4 text-lg text-gray-300">選択された楽曲がありません。</p>
            </div>
        );
    }

    const formatScore = (score: number) => score.toLocaleString();

    const showPlayerResult = (player: Player, scores: number[], winner: boolean) => {
        const totalScore = scores.reduce((acc, score) => acc + score, 0);
        return (
            <div className={`w-full rounded-3xl border-3 ${winner ? 'border-green-500' : 'border-gray-600'} bg-slate-800 grid grid-cols-3 items-center text-white text-center mt-6 p-4`}>
                <div className="text-2xl">
                    {player.name}
                </div>
                <div className="font-bold text-3xl">
                    {formatScore(totalScore)}
                </div>
                <div>
                    ①{formatScore(scores[0])} <br />
                    ②{formatScore(scores[1])} <br />
                    ③{formatScore(scores[2])}
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-4 text-center md:px-10 md:py-6">
            <h2>試合結果</h2>
            <p className="py-2 text-xl text-gray-300 text-left">
                ①{playerA.song.title} / ②{playerB.song.title} / ③{roundState.selectedSong.title}
            </p>

            {showPlayerResult(playerA, scoresPlayerA, totalScoreA > totalScoreB)}

            {showPlayerResult(playerB, scoresPlayerB, totalScoreB > totalScoreA)}
        </div>
    )
}