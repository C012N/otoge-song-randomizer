// 型定義ファイル

import { z } from "zod"

// 楽曲データ
const SongSchema = z.object({
    title: z.string(),
    difficulty: z.string(),
    level: z.string(),
});

// 選手データ
const PlayerSchema = z.object({
    name: z.string(),
    song: SongSchema,
});

// 団体データ
const TeamSchema = z.object({
    name: z.string(),
});

// 試合データ
const RoundSchema = z.object({
    name: z.string(),
    playerA: PlayerSchema,
    playerB: PlayerSchema,
    songs: z.array(SongSchema),
});

// 部門データ
const DivisionSchema = z.object({
    gameTitle: z.string(),
    rounds: z.array(RoundSchema),
});

// 大会データ
const TournamentSchema = z.object({
    name: z.string(),
    teamA: TeamSchema,
    teamB: TeamSchema,
    divisions: z.array(DivisionSchema),
});

// 型定義の自動生成
type Song = z.infer<typeof SongSchema>;
type Player = z.infer<typeof PlayerSchema>;
type Team = z.infer<typeof TeamSchema>;
type Round = z.infer<typeof RoundSchema>;
type Division = z.infer<typeof DivisionSchema>;
type Tournament = z.infer<typeof TournamentSchema>;

// ファイルローダーが返す型
type LoadTournamentResult = {
    tournament: Tournament;
    imageMap: Map<string, string>;
}

// 抽選状態
type SelectState =
    | "not_started"
    | "spinning"
    | "displaying"
    | "showResult" // 試合結果表示画面　後で作る
    | "finished"

// 試合、部門、大会のスコア付きデータ
// useStateで管理するものはここ
type RoundState = {
    selectedSong: Song | null;
    setSongs: Song[];
    scoresPlayerA: number[];
    scoresPlayerB: number[];
    selectState: SelectState;
}

type DivisionState = {
    roundStates: RoundState[];
    scoreTeamA: number;
    scoreTeamB: number;
}

type TournamentState = {
    divisionStates: DivisionState[];
    scoreTeamA: number;
    scoreTeamB: number;
}

export {
    TournamentSchema,
    type Song,
    type Player,
    type Team,
    type Round,
    type Division,
    type Tournament,
    type LoadTournamentResult,
    type SelectState,
    type RoundState,
    type DivisionState,
    type TournamentState
}