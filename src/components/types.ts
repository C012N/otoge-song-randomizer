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
    judge: z.string(),
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
}

// 抽選状態
type SelectState =
    | "division_card" // 部門紹介画面
    | "round_card" // 試合紹介画面
    | "not_started" // 抽選待機中
    | "spinning" // 抽選中
    | "displaying" // 抽選終了
    | "banning" // 抽選楽曲一覧表示中
    | "showResult" // 試合結果画面

// 勝敗
type Judge =
    | "teamA"
    | "teamB"
    | "even"
    | "none"

// 試合、部門、大会のスコア付きデータ
// useStateで管理するものはここ
type RoundState = {
    selectedSong: Song | null;
    selectedSongs: Song[];
    setSongs: Song[];
    scoresPlayerA: number[];
    scoresPlayerB: number[];
    selectState: SelectState;
    isSongOpened: boolean;
    judge: Judge;
}

type DivisionState = {
    roundStates: RoundState[];
    judge: Judge;
}

type TournamentState = {
    divisionStates: DivisionState[];
    judge: Judge;
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
    type Judge,
    type RoundState,
    type DivisionState,
    type TournamentState
}