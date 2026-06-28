// 大会状態管理用のカスタムフック
// useTournamentState: tournamentStateの状態を管理する
// 以下同様

import { type Song, type SelectState, type TournamentState, type Tournament, type RoundState } from "../types";

type UseTournamentStateProps = {
    tournament: Tournament;
    setTournament: (tournament: Tournament | null) => void;
    tournamentState: TournamentState
    setTournamentState: (tournamentState: TournamentState | null) => void;
    numCurrentDivision: number;
    setNumCurrentDivision: (num: number) => void;
    numCurrentRound: number;
    setNumCurrentRound: (num: number) => void;
}

export function useTournamentState({
    tournament,
    setTournament,
    tournamentState,
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
        if (!tournamentState) return;
        const currentRoundState = tournamentState.divisionStates[numCurrentDivision].roundStates[numCurrentRound];
        updater(currentRoundState);
        setTournamentState({ ...tournamentState });
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
        const numPreviousRound = Math.max(numCurrentRound - 1, 0);
        setNumCurrentRound(numPreviousRound);
    }
    const nextRound = () => {
        const numNextRound = Math.min(numCurrentRound + 1,
            tournament.divisions[numCurrentDivision].rounds.length - 1);
        setNumCurrentRound(numNextRound);
    };

    // 部門進行
    const previousDivision = () => {
        const numPreviousDivision = Math.max(numCurrentDivision - 1, 0);
        setNumCurrentDivision(numPreviousDivision);
        setNumCurrentRound(0);
    };
    const nextDivision = () => {
        const numNextDivision = Math.min(numCurrentDivision + 1,
            tournament.divisions.length - 1);
        setNumCurrentDivision(numNextDivision);
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