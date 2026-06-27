import type React from "react";
import { type Song, type SelectState, type TournamentState, type Tournament, type RoundState, type DivisionState } from "../types";

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
    // 補助: 試合状態更新
    const updateRoundState = (
        updater: (roundState: RoundState) => void,
    ) => {
        setTournamentState(prev => {
            if (!prev) return prev;
            const next = structuredClone(prev);
            updater(next.divisionStates[numCurrentDivision].roundStates[numCurrentRound]);
            return next;
        })
    }

    // 補助: 部門状態更新
    const updateDivisionState = (
        updater: (divisionState: DivisionState) => void,
    ) => {
        setTournamentState(prev => {
            if (!prev) return prev;
            const next = structuredClone(prev);
            updater(next.divisionStates[numCurrentDivision]);
            return next;
        })
    }

    // 各初期状態
    const initialTournamentState = createInitialTournamentState(tournament);
    const initialDivisionState = initialTournamentState.divisionStates[numCurrentDivision];
    const initialRoundState = initialDivisionState.roundStates[numCurrentRound];

    // 楽曲更新
    const setSong = (song: Song | null) => {
        updateRoundState(roundState => roundState.selectedSong = song);
    }

    // 選曲状態更新
    const setSelectState = (state: SelectState) => {
        updateRoundState(roundState => roundState.selectState = state);
    }

    // スコア更新
    const setScoresPlayerA = (scores: number[]) => {
        updateRoundState(roundState => roundState.scoresPlayerA = scores);
    }
    const setScoresPlayerB = (scores: number[]) => {
        updateRoundState(roundState => roundState.scoresPlayerB = scores);
    }

    // 試合進行
    const previousRound = () => {
        setNumCurrentRound(prev => prev - 1);
    }
    const nextRound = () => {
        setNumCurrentRound(prev => prev + 1);
    };

    // 試合リセット
    const resetCurrentRound = () => {
        updateRoundState(() => initialRoundState);
    }

    // 部門進行
    const previousDivision = () => {
        setNumCurrentDivision(prev => prev - 1);
        setNumCurrentRound(0);
    };
    const nextDivision = () => {
        setNumCurrentDivision(prev => prev + 1);
        setNumCurrentRound(0);
    };

    // 部門リセット
    const resetDivision = () => {
        updateDivisionState(() => initialDivisionState);
        setNumCurrentRound(0);
    }

    // 大会リセット
    const resetTournament = () => {
        setTournamentState(initialTournamentState);
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