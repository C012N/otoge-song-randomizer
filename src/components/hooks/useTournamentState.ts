// 大会状態管理用のカスタムフック
// useTournamentState: tournamentStateの状態を管理する
// 以下同様

import { type Song, type SelectState, type TournamentState, type Tournament, type RoundState, type DivisionState } from "../types";

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
    const currentDivisionState = tournamentState.divisionStates[numCurrentDivision];
    const currentRoundState = currentDivisionState.roundStates[numCurrentRound];
    // 補助: 部門状態更新
    const updateDivisionState = (
        updater: (divisionState: DivisionState) => void,
    ) => {
        if (!tournamentState) return;
        updater(currentDivisionState);
        setTournamentState({ ...tournamentState });
    }
    // 補助: 試合状態更新
    const updateRoundState = (
        updater: (roundState: RoundState) => void,
    ) => {
        if (!tournamentState) return;
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

    // 部門カード画面への遷移
    const showDivisionCard = () => {
        setSelectState("division_card");
    }

    // 試合カード画面への遷移
    const showRoundCard = () => {
        setSelectState("round_card");
    }

    // 自選曲の公開
    const openSong = () => {
        updateRoundState(roundState => roundState.isSongOpened = true)
    }

    // 課題曲抽選画面への遷移
    const showRoulette = () => {
        setSelectState("not_started");
    }

    // 抽選楽曲表示
    const showSelectedSongs = () => {
        updateRoundState(roundState =>
            (roundState.selectState !== "banning")
            ? setSelectState("banning")
            : setSelectState("not_started")
        );
    }

    // 課題曲選択
    const selectSong1 = () => {
        setSong(currentRoundState.selectedSongs[0])
        setSelectState("displaying")
    }

    const selectSong2 = () => {
        setSong(currentRoundState.selectedSongs[1])
        setSelectState("displaying")
    }

    const selectSong3 = () => {
        setSong(currentRoundState.selectedSongs[2])
        setSelectState("displaying")
    }

    // スコア更新
    const setScoresPlayerA = (scores: number[]) => {
        updateRoundState(roundState => roundState.scoresPlayerA = scores);
    }
    const setScoresPlayerB = (scores: number[]) => {
        updateRoundState(roundState => roundState.scoresPlayerB = scores);
    }

    // 試合結果表示
    const showRoundResult = () => {
        updateRoundState(roundState =>
            (roundState.selectState !== "showResult")
            ? setSelectState("showResult")
            : setSelectState("not_started")
        );
    }

    // 試合進行
    const previousRound = () => {
        const numPreviousRound = Math.max(numCurrentRound - 1, 0);
        setNumCurrentRound(numPreviousRound);
        const prevRoundState = tournamentState
            .divisionStates[numCurrentDivision]
            .roundStates[numPreviousRound];
        prevRoundState.selectState = "division_card";
        updateRoundState(() => prevRoundState)
    }
    const nextRound = () => {
        const numNextRound = Math.min(numCurrentRound + 1,
            tournament.divisions[numCurrentDivision].rounds.length - 1);
        setNumCurrentRound(numNextRound);
        const nextRoundState = tournamentState
            .divisionStates[numCurrentDivision]
            .roundStates[numNextRound];
        nextRoundState.selectState = "division_card";
        updateRoundState(() => nextRoundState)
    };

    // 部門進行
    const previousDivision = () => {
        const numPreviousDivision = Math.max(numCurrentDivision - 1, 0);
        setNumCurrentDivision(numPreviousDivision);
        setNumCurrentRound(0);
        const prevDivisionState = tournamentState
            .divisionStates[numPreviousDivision];
        updateDivisionState(() => prevDivisionState);        
    };

    const nextDivision = () => {
        const numNextDivision = Math.min(numCurrentDivision + 1,
            tournament.divisions.length - 1);
        setNumCurrentDivision(numNextDivision);
        setNumCurrentRound(0);
        const nextDivisionState = tournamentState
            .divisionStates[numCurrentDivision];
        updateDivisionState(() => nextDivisionState);
    };

    return {
        setSong,
        setSelectedSongs,
        setSelectState,
        showDivisionCard,
        showRoundCard,
        openSong,
        showRoulette,
        showSelectedSongs,
        selectSong1,
        selectSong2,
        selectSong3,
        setScoresPlayerA,
        setScoresPlayerB,
        showRoundResult,
        previousRound,
        nextRound,
        previousDivision,
        nextDivision,
    }
}