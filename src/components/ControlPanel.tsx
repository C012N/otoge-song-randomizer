// 大会進行パネルのコンポーネント
// 大会進行状況の表示と操作を行う
// /controlルートでのみ表示される

import type { TournamentState } from "./types"
import { ScoreInput } from "./ScoreInput";

type ControlPanelProps = {
    tournamentState: TournamentState;
    numCurrentDivision: number;
    numCurrentRound: number;
    onSelectSong: () => void;
    scoresPlayerA: number[];
    scoresPlayerB: number[];
    setScoresPlayerA: (scores: number[]) => void;
    setScoresPlayerB: (scores: number[]) => void;
    onPrevRound: () => void;
    onNextRound: () => void;
    onPrevDivision: () => void;
    onNextDivision: () => void;
    onResetTournament: () => void;
}

export function ControlPanel({
    tournamentState,
    numCurrentDivision,
    numCurrentRound,
    onSelectSong,
    scoresPlayerA,
    scoresPlayerB,
    setScoresPlayerA,
    setScoresPlayerB,
    onPrevRound,
    onNextRound,
    onPrevDivision,
    onNextDivision,
    onResetTournament
}: ControlPanelProps) {
    const selectState = tournamentState
        .divisionStates[numCurrentDivision]
        .roundStates[numCurrentRound]
        .selectState;
    const numDivisions = tournamentState.divisionStates.length;
    const numRounds = tournamentState.divisionStates[numCurrentDivision].roundStates.length;
    return (
        <div>
            <button
                onClick={onSelectSong}
                disabled={selectState === "spinning"}
            >
                選曲！
            </button>
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

            <h3>試合進行</h3>

            <button
                onClick={onPrevRound}
                disabled={numCurrentRound === 0
                    || selectState === "spinning"}
            >
                前の試合へ
            </button>

            <button
                onClick={onNextRound}
                disabled={numCurrentRound === numRounds - 1
                    || selectState === "spinning"}>
                次の試合へ
            </button>

            <h3>部門進行</h3>

            <button
                onClick={onPrevDivision}
                disabled={numCurrentDivision === 0
                    || selectState === "spinning"}
            >
                前の部門へ
            </button>

            <button
                onClick={onNextDivision}
                disabled={numCurrentDivision === numDivisions - 1
                    || selectState === "spinning"}
            >
                次の部門へ
            </button>

            <h3>大会進行</h3>

            <button
                onClick={onResetTournament}
                disabled={selectState === "spinning"}
            >
                大会全体をリセット
            </button>
        </div>
    )
}