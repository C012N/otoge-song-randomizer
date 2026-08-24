// 大会状態管理用のカスタムフック
// useTournamentState: tournamentStateの状態を管理する
// 以下同様

import { type Song, type SelectState, type TournamentState, type Tournament, type RoundState } from "../types";

type UseTournamentStateProps = {
    tournament: Tournament;
    tournamentState: TournamentState
    setTournamentState: (tournamentState: TournamentState | null) => void;
    numCurrentDivision: number;
    setNumCurrentDivision: (num: number) => void;
    numCurrentRound: number;
    setNumCurrentRound: (num: number) => void;
}

export function useTournamentState({
    tournament,
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

    // 抽選履歴更新
    const setSelectedSongs = (song: Song) => {
        updateRoundState(roundState => roundState.selectedSongs.push(song));
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

    // 抽選楽曲表示
    const showSelectedSongs = () => {
        updateRoundState(roundState =>
            (roundState.selectState !== "banning")
            ? (roundState.selectState = "banning")
            : (roundState.selectState = "not_started")
        );
    }

    // 試合結果表示
    const showRoundResult = () => {
        updateRoundState(roundState =>
            (roundState.selectState !== "showResult")
            ? (roundState.selectState = "showResult")
            : (roundState.selectState = "not_started"));
    }

    // 試合進行
    const previousRound = () => {
        const numPreviousRound = Math.max(numCurrentRound - 1, 0);
        setNumCurrentRound(numPreviousRound);
        updateRoundState(roundState => roundState.selectState = "not_started");
    }
    const nextRound = () => {
        const numNextRound = Math.min(numCurrentRound + 1,
            tournament.divisions[numCurrentDivision].rounds.length - 1);
        setNumCurrentRound(numNextRound);
        updateRoundState(roundState => roundState.selectState = "not_started");
    };

    // 部門進行
    const previousDivision = () => {
        const numPreviousDivision = Math.max(numCurrentDivision - 1, 0);
        setNumCurrentDivision(numPreviousDivision);
        setNumCurrentRound(0);
        updateRoundState(roundState => roundState.selectState = "not_started");
    };

    const nextDivision = () => {
        const numNextDivision = Math.min(numCurrentDivision + 1,
            tournament.divisions.length - 1);
        setNumCurrentDivision(numNextDivision);
        setNumCurrentRound(0);
        updateRoundState(roundState => roundState.selectState = "not_started");
    };

    return {
        setSong,
        setSelectedSongs,
        setSelectState,
        setScoresPlayerA,
        setScoresPlayerB,
        showSelectedSongs,
        showRoundResult,
        previousRound,
        nextRound,
        previousDivision,
        nextDivision,
    }
}