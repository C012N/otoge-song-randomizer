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
            <div className="w-screen h-screen bg-[#0f172a] text-white flex flex-col justify-center items-center select-none font-sans p-4">
                <h1 className="text-3xl font-black tracking-wider">
                    {divisionName} - {roundName}
                </h1>
                <p className="mt-4 text-lg text-gray-300">選択された楽曲がありません。</p>
            </div>
        );
    }
    const songs = [playerA.song, playerB.song, roundState.selectedSong];

    const formatScore = (score: number) => score.toLocaleString();

    const makeTableBody = () => {
        return songs.map((song, i) => (
            <tr key={i}>
                <td className="py-3 px-4 text-center">{formatScore(scoresPlayerA[i])}</td>
                <td className="py-3 px-6 text-center">{song.title} {"(" + song.difficulty + " " + song.level + ")"}</td>
                <td className="py-3 px-4 text-center">{formatScore(scoresPlayerB[i])}</td>
            </tr>
        ));
    }

    return (
        <div className="max-w-4xl mx-auto my-8 p-6 bg-slate-900/80 border-2 border-slate-700 rounded-xl shadow-2xl text-white">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th>{playerA.name}</th>
                        <th></th>
                        <th>{playerB.name}</th>
                    </tr>
                </thead>
                <tbody>
                    {makeTableBody()}
                    <tr>
                        <td className="total-score">{formatScore(totalScoreA)}</td>
                        <td className="total-label">合計</td>
                        <td className="total-score">{formatScore(totalScoreB)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}