// 大会進行パネルのコンポーネント
// 大会進行状況の表示と操作を行う
// /controlルートでのみ表示される

import type { Round, TournamentState } from "./types"
import { ScoreInput } from "./ScoreInput";
import { Button } from "./TailwindCssDefaults";

type ControlPanelProps = {
    tournamentState: TournamentState;
    currentRound: Round;
    numCurrentDivision: number;
    numCurrentRound: number;
    onSelectSong: () => void;
    scoresPlayerA: number[];
    scoresPlayerB: number[];
    setScoresPlayerA: (scores: number[]) => void;
    setScoresPlayerB: (scores: number[]) => void;
    onShowSelectedSongs: () => void;
    onShowRoundResult: () => void;
    onPrevRound: () => void;
    onNextRound: () => void;
    onPrevDivision: () => void;
    onNextDivision: () => void;
}

export function ControlPanel({
    tournamentState,
    currentRound,
    numCurrentDivision,
    numCurrentRound,
    onSelectSong,
    scoresPlayerA,
    scoresPlayerB,
    setScoresPlayerA,
    setScoresPlayerB,
    onShowSelectedSongs,
    onShowRoundResult,
    onPrevRound,
    onNextRound,
    onPrevDivision,
    onNextDivision,
}: ControlPanelProps) {
    const selectState = tournamentState
        .divisionStates[numCurrentDivision]
        .roundStates[numCurrentRound]
        .selectState;
    const numDivisions = tournamentState.divisionStates.length;
    const numRounds = tournamentState.divisionStates[numCurrentDivision].roundStates.length;
    return (
        <div>
            <h2>コントロールパネル</h2>

            <div>
                <Button
                    children="選曲！"
                    onClick={onSelectSong}
                    disabled={
                        selectState === "spinning" ||
                        currentRound.songs.length === 0
                    }
                />
                
                <ScoreInput
                    label="Player A"
                    scores={scoresPlayerA}
                    onChange={setScoresPlayerA}
                />

                <ScoreInput
                    label="Player B"
                    scores={scoresPlayerB}
                    onChange={setScoresPlayerB}
                />
            </div>

            <div>
                <Button
                    children="抽選楽曲一覧を表示"
                    onClick={onShowSelectedSongs}
                    disabled={selectState === "spinning"}
                />
            </div>

            <div>
                <Button
                    children="試合結果を表示"
                    onClick={onShowRoundResult}
                    disabled={selectState === "spinning"}
                />
            </div>

            <div>
                <Button
                    children="前の試合へ"
                    onClick={onPrevRound}
                    disabled={
                        numCurrentRound === 0
                        || selectState === "spinning"
                    }
                />

                <Button
                    children="次の試合へ"
                    onClick={onNextRound}
                    disabled={numCurrentRound === numRounds - 1
                        || selectState === "spinning"}
                />
            </div>

            <div>
                <Button
                    children="前の部門へ"
                    onClick={onPrevDivision}
                    disabled={
                        numCurrentDivision === 0
                        || selectState === "spinning"}
                />

                <Button
                    children="次の部門へ"
                    onClick={onNextDivision}
                    disabled={
                        numCurrentDivision === numDivisions - 1
                        || selectState === "spinning"}
                />
            </div>

        </div>
    )
}