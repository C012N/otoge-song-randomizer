// 大会状態管理用のカスタムフック
// useTournamentState: tournamentStateの状態を管理する
// 以下同様

import { type Song, type SelectState, type TournamentState, type Tournament, type RoundState, type DivisionState, type Judge } from "../types";

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
    const currentDivision = tournament.divisions[numCurrentDivision];
    const currentRound = currentDivision.rounds[numCurrentRound];
    const currentDivisionState = tournamentState.divisionStates[numCurrentDivision];
    const currentRoundState = currentDivisionState.roundStates[numCurrentRound];

    // 補助: 大会状態更新
    // const updateTournamentState = (
    //     updater: (tournamentState: TournamentState) => void
    // ) => {
    //     if (!tournamentState) return;
    //     updater(tournamentState);
    //     setTournamentState({ ...tournamentState });
    // }

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

    // 試合勝敗更新
    const setRoundJudge = (judge: Judge) => {
        updateRoundState(roundState => roundState.judge = judge);
    }

    // 部門勝敗更新
    const setDivisionJudge = (judge: Judge) => {
        updateDivisionState(divisionState => divisionState.judge = judge);
    }

    // 大会勝敗更新
    // const setTournamentJudge = (judge: Judge) => {
    //     updateTournamentState(tournamentState => tournamentState.judge = judge);
    // }

    // 試合勝敗判定
    function judgeRound (method: string, roundState: RoundState) {
        switch (method) {
            case "合計点制": {
                const totalScoreA = roundState.scoresPlayerA.reduce((acc, score) => acc + score, 0);
                const totalScoreB = roundState.scoresPlayerB.reduce((acc, score) => acc + score, 0);
                if (totalScoreA > totalScoreB) setRoundJudge("teamA");
                else if (totalScoreA < totalScoreB) setRoundJudge("teamB");
                else if (totalScoreA === totalScoreB && totalScoreA + totalScoreB > 0) setRoundJudge("even");
                else setRoundJudge("none");
                return;
            }
            case "勝ち点制": {
                const pointsPlayerA: number[] = roundState.scoresPlayerA
                    .map((score, i) => score >= roundState.scoresPlayerB[i] ? 1 : 0);
                const pointsPlayerB: number[] = roundState.scoresPlayerB
                    .map((score, i) => score >= roundState.scoresPlayerA[i] ? 1 : 0);
                const totalPointA = pointsPlayerA.reduce((acc, point) => acc + point, 0);
                const totalPointB = pointsPlayerB.reduce((acc, point) => acc + point, 0);
                if (totalPointA > totalPointB) setRoundJudge("teamA");
                else if (totalPointA < totalPointB) setRoundJudge("teamB");
                else if (totalPointA === totalPointB && totalPointA + totalPointB > 0) setRoundJudge("even");
                else setRoundJudge("none");
                return;
            }
            case "MEGAMIX": {
                const totalPointA = roundState.scoresPlayerA[0];
                const totalPointB = roundState.scoresPlayerB[0];
                if (totalPointA > totalPointB) setRoundJudge("teamA");
                else if (totalPointA < totalPointB) setRoundJudge("teamB");
                else if (totalPointA === totalPointB && totalPointA + totalPointB > 0) setRoundJudge("even");
                else setRoundJudge("none");
                return;
            }
            default: {
                setRoundJudge("none");
                return;
            }
        };
    }

    // ポイント計算
    const calcRoundPoint: (roundState: RoundState, teamName: string) => number = (roundState, teamName) => {
        if (teamName === tournament.teamA.name) {
            switch (roundState.judge) {
                case "teamA": return 1;
                case "even": return 1;
                default: return 0;
            };
        }
        else {
            switch (roundState.judge) {
                case "teamB": return 1;
                case "even": return 1;
                default: return 0;
            };
        };
    }

    const calcDivisionPoint: (divisionState: DivisionState, teamName: string) => number = (divisionState, teamName) => {
        const roundPoints = divisionState.roundStates.map(roundState => calcRoundPoint(roundState, teamName));
        return roundPoints.reduce((acc, point) => acc + point, 0);
    }

    const calcTournamentPoint: (tournamentState: TournamentState, teamName: string) => number = (tournamentState, teamName) => {
        const divisionPoints = tournamentState.divisionStates.map(divisionState => calcDivisionPoint(divisionState, teamName));
        return divisionPoints.reduce((acc, point) => acc + point, 0);
    }

    // 部門・大会の勝敗決定
    function judgeDivision (divisionState: DivisionState) {
        const pointTeamA = calcDivisionPoint(divisionState, tournament.teamA.name);
        const pointTeamB = calcDivisionPoint(divisionState, tournament.teamB.name);
        if (pointTeamA > pointTeamB) setDivisionJudge("teamA");
        else if (pointTeamA < pointTeamB) setDivisionJudge("teamB");
        else if (pointTeamA === pointTeamB && pointTeamA + pointTeamB > 0) setDivisionJudge("even");
        else setDivisionJudge("none");
    }

    // function judgeTournament (tournament: Tournament) {
    //     const pointTeamA = calcTournamentPoint(tournament, tournament.teamA.name);
    //     const pointTeamB = calcTournamentPoint(tournament, tournament.teamB.name);
    //     if (pointTeamA > pointTeamB) setTournamentJudge("teamA");
    //     else if (pointTeamA < pointTeamB) setTournamentJudge("teamB");
    //     else if (pointTeamA === pointTeamB && pointTeamA + pointTeamB > 0) setTournamentJudge("even");
    //     else setTournamentJudge("none");
    // }

    // 部門カード画面への遷移
    const showDivisionCard = () => {
        judgeDivision(currentDivisionState);
        setSelectState("division_card");
    }

    // 試合カード画面への遷移
    const showRoundCard = () => {
        judgeRound(currentRound.judge, currentRoundState);
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
        judgeRound(currentRound.judge, currentRoundState);
        judgeDivision(currentDivisionState);
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
        calcRoundPoint,
        calcDivisionPoint,
        calcTournamentPoint,
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