import type React from "react";
import { type Song, type SelectState, type TournamentState, type Tournament, type RoundState } from "../types";

type UseTournamentStateProps = {
    tournament: Tournament;
    setTournament: React.Dispatch<React.SetStateAction<Tournament | null>>;
    tournamentState: TournamentState
    setTournamentState: React.Dispatch<React.SetStateAction<TournamentState | null>>;
    createInitialTournamentState: (tournament: Tournament) => TournamentState;
    numCurrentDivision: number;
    setNumCurrentDivision: React.Dispatch<React.SetStateAction<number>>;
    numCurrentRound: number;
    setNumCurrentRound: React.Dispatch<React.SetStateAction<number>>;
}

export function useTournamentState({
    setTournament,
    setTournamentState,
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

    // 部門進行
    const previousDivision = () => {
        setNumCurrentDivision(prev => prev - 1);
        setNumCurrentRound(0);
    };
    const nextDivision = () => {
        setNumCurrentDivision(prev => prev + 1);
        setNumCurrentRound(0);
    };

    // 大会リセット
    const resetTournament = () => {
        setTournament(null);
        setTournamentState(null);
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
        previousDivision,
        nextDivision,
        resetTournament
    }
}