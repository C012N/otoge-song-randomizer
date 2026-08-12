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
            <div className="text-white font-sans p-10">
                <h1>課題曲を選択してください</h1>
            </div>
        );
    }
    const formatScore = (score: number) => score.toLocaleString();

    const formatRedCell = (data: any) => {
        return (
            <td className="h-24 border border-white font-bold pl-4 pr-4 py-4 bg-orange-700/70">
                {data}
            </td>
        )
    }

    const formatBlueCell = (data: any) => {
        return (
            <td className="h-24 border border-white font-bold pl-4 pr-4 py-4 bg-sky-700/70">
                {data}
            </td>
        )
    }

    const formatSongData = (player: Player | null) => {
        return (!player) ? (
            <>
                <p className="text-2xl text-slate-300">
                    課題曲
                </p>
                <p>
                    {roundState.selectedSong?.title} ({roundState.selectedSong?.difficulty} {roundState.selectedSong?.level})
                </p>
            </>
        ) : (
            <>
                <p className="text-2xl text-slate-300">
                    {player.name} 自選
                </p>
                <p>
                    {player.song.title} ({player.song.difficulty} {player.song.level})
                </p>
            </>
        )
    }

    const formatRow = (data1: any, data2: any, data3: any, bgOption: string = "") => {
        return (
            <tr>
                {formatRedCell(data1)}
                <td colSpan={3} className={`h-24 border border-white pl-4 pr-4 py-4 ${bgOption}`}>
                    {data2}
                </td>
                {formatBlueCell(data3)}
            </tr>
        )
    }

    return (
        <div>
            <h1 className="text-4xl font-bold
            [text-shadow:_2px_2px_0_rgb(64_64_64),_-2px_2px_0_rgb(64_64_64),_2px_-2px_0_rgb(64_64_64),_-2px_-2px_0_rgb(64_64_64)]">
                試合結果 <br />
                {divisionName}部門 {roundName}
            </h1>
            <table className="
                w-full
                max-w-8xl
                mx-auto
                table-auto
                border-collapse
                text-center
                text-white
                text-4xl">
                <thead>
                    <tr>
                        <th className="h-24 border border-white pl-4 pr-4 py-4 bg-orange-700/70">
                            {playerA.name}
                        </th>
                        <th className="w-24 h-24 border border-white bg-orange-700/70">
                            {(totalScoreA < totalScoreB) ? "" : "★"}
                        </th>
                        <th></th>
                        <th className="w-24 h-24 border border-white bg-sky-700/70">
                            {(totalScoreA > totalScoreB) ? "" : "★"}
                        </th>
                        <th className="h-24 border border-white pl-4 pr-4 py-4 bg-sky-700/70">
                            {playerB.name}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {formatRow(
                        formatScore(scoresPlayerA[0]),
                        formatSongData(playerA),
                        formatScore(scoresPlayerB[0]),
                        "bg-orange-700/70"
                    )}
                    {formatRow(
                        formatScore(scoresPlayerA[1]),
                        formatSongData(playerB),
                        formatScore(scoresPlayerB[1]),
                        "bg-sky-700/70"
                    )}
                    {formatRow(
                        formatScore(scoresPlayerA[2]),
                        formatSongData(null),
                        formatScore(scoresPlayerB[2]),
                        "bg-slate-700/70"
                    )}
                    {formatRow(
                        formatScore(totalScoreA),
                        "合計",
                        formatScore(totalScoreB),
                        "bg-slate-700/70"
                    )}
                </tbody>
            </table>
        </div>
    )
}