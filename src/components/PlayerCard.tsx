// プレイヤーカードのコンポーネント
// チーム名、プレイヤー名、自選曲、スコアを表示する

type PlayerCardProps = {
    teamName: string;
    playerName: string;
}

export function PlayerCard({
    teamName,
    playerName,
}: PlayerCardProps) {
    return (
        <div className="w-full rounded-xl border border-gray-700 bg-[#18191f] px-6 py-8 text-center shadow-lg md:px-10 md:py-10">
            <p className="mt-2 text-base text-gray-400 md:text-lg lg:text-xl">
                {teamName}
            </p>

            <p className="text-2xl font-bold md:text-3xl lg:text-4xl">
                {playerName}
            </p>
        </div>
    )
}