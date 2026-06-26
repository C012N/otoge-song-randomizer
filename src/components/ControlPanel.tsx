import type { TournamentState } from "./types"
import { ScoreInput } from "./ScoreInput";


type ControlPanelProps = {
    tournamentState: TournamentState;
    numCurrentDivision: number;
    numCurrentRound: number;
    scoresPlayerA: number[];
    scoresPlayerB: number[];
    setScoresPlayerA: (scores: number[]) => void;
    setScoresPlayerB: (scores: number[]) => void;
    onPrevRound: () => void;
    onNextRound: () => void;
    onResetRound: () => void;
    onPrevDivision: () => void;
    onNextDivision: () => void;
    onResetDivision: () => void;
    onResetTournament: () => void;
}

export function ControlPanel({
    tournamentState,
    numCurrentDivision,
    numCurrentRound,
    scoresPlayerA,
    scoresPlayerB,
    setScoresPlayerA,
    setScoresPlayerB,
    onPrevRound,
    onNextRound,
    onResetRound,
    onPrevDivision,
    onNextDivision,
    onResetDivision,
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

            <p></p>

            <button onClick={onResetRound}
                disabled={selectState === "spinning"}>
                この試合をリセット
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

            <p></p>

            <button
                onClick={onResetDivision}
                disabled={selectState === "spinning"}
            >
                部門をリセット
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