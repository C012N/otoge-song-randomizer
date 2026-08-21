// 大会データの読み込み処理
// 与えられたJSONをtournament型にパースして返す

import { TournamentSchema, type LoadTournamentResult } from "./types";

export async function loadTournament(file: File): Promise<LoadTournamentResult> {
    if (!file.name.toLowerCase().endsWith(".json")) {
        throw new Error("JSONファイルを選択してください");
    }
    try {
        const text = await file.text();
        const rawData = JSON.parse(text);

        // ここでバリデーションチェック
        const result = TournamentSchema.safeParse(rawData);

        // 型の異なるJSONにアラート
        if (!result.success) {
            throw new Error("JSONのフォーマットが正しくありません。\nエラー詳細: " + result.error.message);
        }

        return {
            tournament: result.data,
        }
    } catch (e) {
        console.error(e);
        // キャッチしたエラー（JSON.parseの文法エラーや、上のバリデーションエラー）をそのまま上位へ投げる
        if (e instanceof Error) {
            throw e;
        }
        throw new Error("JSONの読み込み中に予期せぬエラーが発生しました。");
    }
}