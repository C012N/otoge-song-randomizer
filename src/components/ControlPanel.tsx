// 大会進行パネルのコンポーネント
// 大会進行状況の表示と操作を行う
// /controlルートでのみ表示される

import type { Round, RoundState, Song, TournamentState } from "./types"
import { ScoreInput } from "./ScoreInput";
import { Button } from "./TailwindCssDefaults";

type ControlPanelProps = {
    tournamentState: TournamentState;
    currentRound: Round;
    currentRoundState: RoundState;
    numCurrentDivision: number;
    numCurrentRound: number;
    onSelectSong: () => void;
    onSetSong: (song: Song | null) => void;
    onSelectSong1: () => void;
    onSelectSong2: () => void;
    onSelectSong3: () => void;
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
    currentRoundState,
    numCurrentDivision,
    numCurrentRound,
    onSelectSong,
    onSelectSong1,
    onSelectSong2,
    onSelectSong3,
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
            <div>
                <Button
                    children="選曲！"
                    onClick={onSelectSong}
                    disabled={
                        selectState === "spinning" ||
                        currentRound.songs.length === 0
                    }
                />

                <div>
                    <Button
                        children="課題曲1を選択"
                        onClick={onSelectSong1}
                        disabled={
                            selectState === "spinning" ||
                            currentRoundState.selectedSongs.length < 1
                        }
                    />

                    <Button
                        children="課題曲2を選択"
                        onClick={onSelectSong2}
                        disabled={
                            selectState === "spinning" ||
                            currentRoundState.selectedSongs.length < 2
                        }
                    />

                    <Button
                        children="課題曲3を選択"
                        onClick={onSelectSong3}
                        disabled={
                            selectState === "spinning" ||
                            currentRoundState.selectedSongs.length < 3
                        }
                    />
                </div>
                
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