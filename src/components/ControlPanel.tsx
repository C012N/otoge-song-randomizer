import type { TournamentState } from "./types"


type ControlPanelProps = {
    tournamentState: TournamentState;
    numCurrentDivision: number;
    numCurrentRound: number;
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

            <p></p>

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

            <p></p>

            <button
                onClick={onResetTournament}
                disabled={selectState === "spinning"}
            >
                大会全体をリセット
            </button>
        </div>
    )
}