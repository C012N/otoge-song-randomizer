import { TournamentSchema, type LoadTournamentResult } from "./types";

export async function loadTournament(files: FileList): Promise<LoadTournamentResult> {
    let jsonFile: File | null = null;
    const images = new Map<string, string>();
    for (const file of Array.from(files)) {
        if (file.name.endsWith(".json")) {
            // 複数のjsonを含むならアラート
            if (jsonFile) {
                throw new Error("JSONファイルはただ一つ含めてください")
            }

            jsonFile = file;
        }
        if (file.type.startsWith("image/")) {
            images.set(
                file.name,
                URL.createObjectURL(file)
            );
        }
    }
    if (!jsonFile) {
        throw new Error("tournament.json が見つかりません");
    }
    try {
        const text = await jsonFile.text();
        const rawData = JSON.parse(text);

        // ここでバリデーションチェック
        const result = TournamentSchema.safeParse(rawData);

        // 型の異なるJSONにアラート
        if (!result.success) {
            throw new Error("JSONのフォーマットが正しくありません。\nエラー詳細: " + result.error.message);
        }

        return {
            tournament: result.data,
            imageMap: images
        }
    } catch (e) {
        alert("JSONのパースに失敗しました。ファイル形式を確認してください。");
    }
    return loadTournament(files);
}