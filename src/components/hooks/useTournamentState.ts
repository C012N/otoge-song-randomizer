import type React from "react";
import { type Song, type SelectState, type TournamentState, type Tournament } from "../types";

type UseTournamentStateProps = {
    tournament: Tournament;
    tournamentState: TournamentState
    setTournamentState: React.Dispatch<React.SetStateAction<TournamentState | null>>;
    createInitialTournamentState: (tournament: Tournament) => TournamentState;
    numCurrentDivision: number;
    setNumCurrentDivision: React.Dispatch<React.SetStateAction<number>>;
    numCurrentRound: number;
    setNumCurrentRound: React.Dispatch<React.SetStateAction<number>>;
}

export function useTournamentState({
    tournament,
    setTournamentState,
    createInitialTournamentState,
    numCurrentDivision,
    setNumCurrentDivision,
    numCurrentRound,
    setNumCurrentRound,
}: UseTournamentStateProps) {
    // 補助関数
    const setSong = (song: Song | null) => {
        setTournamentState(prev => {
            if (!prev) return prev;

            const next = structuredClone(prev);

            next.divisionStates[numCurrentDivision].roundStates[numCurrentRound].selectedSong = song;

            return next;
        }
        )
    }

    const setSelectState = (state: SelectState) => {
        setTournamentState(prev => {
            if (!prev) return prev;

            const next = structuredClone(prev);

            next.divisionStates[numCurrentDivision].roundStates[numCurrentRound].selectState = state;

            return next;
        })
    }

    const setScoresPlayerA = (scores: number[]) => {
        setTournamentState(prev => {
            if (!prev) return prev;

            const next = structuredClone(prev);

            next.divisionStates[numCurrentDivision].roundStates[numCurrentRound].scoresPlayerA = scores;

            return next;
        })
    }

    const setScoresPlayerB = (scores: number[]) => {
        setTournamentState(prev => {
            if (!prev) return prev;

            const next = structuredClone(prev);

            next.divisionStates[numCurrentDivision].roundStates[numCurrentRound].scoresPlayerB = scores;

            return next;
        })
    }

    // 試合の進行
    const previousRound = () => {
        setNumCurrentRound(prev => prev - 1);
    }
    const nextRound = () => {
        setNumCurrentRound(prev => prev + 1);
    };

    // 試合のリセット
    const resetCurrentRound = () => {
        setTournamentState(prev => {
            if (!prev) return prev;

            const next = structuredClone(prev);

            next.divisionStates[numCurrentDivision].roundStates[numCurrentRound] = {
                selectedSong: null,
                selectedSongs: [],
                scoresPlayerA: [0, 0, 0],
                scoresPlayerB: [0, 0, 0],
                selectState: "not_started"
            }

            return next;
        }

        )
    }

    // 部門の進行
    const previousDivision = () => {
        setNumCurrentDivision(prev => prev - 1);
        setNumCurrentRound(0);
    };

    const nextDivision = () => {
        setNumCurrentDivision(prev => prev + 1);
        setNumCurrentRound(0);
    };

    const resetDivision = () => {
        setTournamentState(prev => {
            if (!prev) return prev;

            const next = structuredClone(prev);

            next.divisionStates[numCurrentDivision] = ({
                roundStates: next.divisionStates[numCurrentDivision].roundStates.map(() => ({
                    selectedSong: null,
                    selectedSongs: [],
                    scoresPlayerA: [0, 0, 0],
                    scoresPlayerB: [0, 0, 0],
                    selectState: "not_started" as SelectState
                })),
                scoreTeamA: 0,
                scoreTeamB: 0
            })

            return next;
        })

        setNumCurrentRound(0);
    }

    // 大会全体のリセット
    const resetTournament = () => {
        setTournamentState(createInitialTournamentState(tournament));
        setNumCurrentDivision(0);
        setNumCurrentRound(0);
    };
    return {
        setSong,
        setSelectState,
        setScoresPlayerA,
        setScoresPlayerB,
        previousRound,
        nextRound,
        resetCurrentRound,
        previousDivision,
        nextDivision,
        resetDivision,
        resetTournament
    }
}