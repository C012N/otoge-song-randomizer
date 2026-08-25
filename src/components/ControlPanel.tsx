// 大会進行パネルのコンポーネント
// 大会進行状況の表示と操作を行う
// /controlルートでのみ表示される

import type { Tournament, TournamentState } from "./types"
import { ScoreInput } from "./ScoreInput";
import { Button } from "./TailwindCssDefaults";
import { useTournamentState } from "./hooks/useTournamentState";

type ControlPanelProps = {
    tournament: Tournament
    tournamentState: TournamentState
    setTournamentState: (tournamentState: TournamentState | null) => void
    numCurrentDivision: number
    setNumCurrentDivision: (num: number) => void
    numCurrentRound: number
    setNumCurrentRound: (num: number) => void
    selectSong: () => void
}

export function ControlPanel({
    tournament,
    tournamentState,
    setTournamentState,
    numCurrentDivision,
    setNumCurrentDivision,
    numCurrentRound,
    setNumCurrentRound,
    selectSong
}: ControlPanelProps) {
    const {showDivisionCard,
        showRoundCard,
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
        nextDivision} = useTournamentState({
            tournament,
    tournamentState,
    setTournamentState,
    numCurrentDivision,
    setNumCurrentDivision,
    numCurrentRound,
    setNumCurrentRound})
    const currentRound = tournament.divisions[numCurrentDivision].rounds[numCurrentRound]
    const currentRoundState = tournamentState.divisionStates[numCurrentDivision].roundStates[numCurrentRound]
    const selectState = currentRoundState.selectState;
    const scoresPlayerA = currentRoundState.scoresPlayerA
    const scoresPlayerB = currentRoundState.scoresPlayerB
    const numDivisions = tournamentState.divisionStates.length;
    const numRounds = tournamentState.divisionStates[numCurrentDivision].roundStates.length;
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <Button
                children="部門紹介画面"
                onClick={showDivisionCard}
                disabled={selectState === "spinning"}
            />

            <Button
                children="試合紹介画面"
                onClick={showRoundCard}
                disabled={selectState === "spinning"}
            />

            <Button
                children="課題曲抽選画面"
                onClick={showRoulette}
                disabled={selectState === "spinning"}
            />

            <Button
                children="選曲！"
                onClick={selectSong}
                disabled={
                    selectState === "spinning" ||
                    currentRound.songs.length === 0
                }
            />

            <Button
                children="抽選楽曲一覧を表示"
                onClick={showSelectedSongs}
                disabled={selectState === "spinning"}
            />

            <div className="flex gap-4">
                <Button
                    children="課題曲1を選択"
                    onClick={selectSong1}
                    disabled={
                        selectState === "spinning" ||
                        currentRoundState.selectedSongs.length < 1
                    }
                />

                <Button
                    children="課題曲2を選択"
                    onClick={selectSong2}
                    disabled={
                        selectState === "spinning" ||
                        currentRoundState.selectedSongs.length < 2
                    }
                />

                <Button
                    children="課題曲3を選択"
                    onClick={selectSong3}
                    disabled={
                        selectState === "spinning" ||
                        currentRoundState.selectedSongs.length < 3
                    }
                />
            </div>

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

            <Button
                children="試合結果を表示"
                onClick={showRoundResult}
                disabled={selectState === "spinning"}
            />

            <div className="flex gap-4">
                <Button
                    children="前の試合へ"
                    onClick={previousRound}
                    disabled={
                        numCurrentRound === 0
                        || selectState === "spinning"
                    }
                />

                <Button
                    children="次の試合へ"
                    onClick={nextRound}
                    disabled={numCurrentRound === numRounds - 1
                        || selectState === "spinning"}
                />
            </div>

            <div className="flex gap-4">
                <Button
                    children="前の部門へ"
                    onClick={previousDivision}
                    disabled={
                        numCurrentDivision === 0
                        || selectState === "spinning"}
                />

                <Button
                    children="次の部門へ"
                    onClick={nextDivision}
                    disabled={
                        numCurrentDivision === numDivisions - 1
                        || selectState === "spinning"}
                />
            </div>
        </div>
    )
}