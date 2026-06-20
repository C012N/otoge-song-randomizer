import { useEffect, useState } from "react";

// 楽曲の型
type Song = {
  title: string;
  difficulty: string;
  level: string;
  jacket: string;
};

// 抽選状態の型
type SelectState =
  | "not_started"
  | "selecting"
  | "finished";

function App() {
  // 楽曲の状態
  const [song, setSong] = useState<Song | null>(null);

  // 選曲済み楽曲リストの状態
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);

  // 重複選曲を許すかどうかの状態
  const [canSelectTwice, setCanSelectTwice] = useState(false);

  // 楽曲リスト.jsonの読み込み
  // 状態の用意
  const [songs, setSongs] = useState<Song[]>([]);
  useEffect(() => {
    fetch("/songs.json")
    // jsonとして解釈
    .then(Response => Response.json())
    // 状態に保存
    .then(data => {
      setSongs(data);
    });
  }, []);
  // ログの出力
  console.log(songs);

  // 抽選可能楽曲の状態
  const availableSongs = canSelectTwice ? songs
  : songs.filter(song => !selectedSongs.some(
    selected => selected.title === song.title));

  // 抽選状態
  const [selectState, setSelectState] = useState<SelectState>("not_started");

  // 抽選する関数
  const selectSong = () => {
    if (availableSongs.length === 0) {
      setSong(null);
      // 状態の更新
      setSelectState("finished");
      return;
    }
    // ランダムにインデックスを抽選して選曲
    const randomIndex = Math.floor(Math.random() * availableSongs.length);
    const selectedSong = availableSongs[randomIndex];
    setSong(selectedSong);
    // 状態の更新
    setSelectState("selecting");
    // 抽選済み楽曲リストに追加
    setSelectedSongs(prev => [...prev, selectedSong]);
  };

  // null値も自然に描画するための処理
  const displaySong = song ?? {
    title: "???",
    difficulty: "???",
    level: "???",
    jacket: "/jackets/dummy.png"
  }

  let displayByState;
  if (selectState === "not_started") {
    displayByState = (
      <>
        <img
          src="/jackets/dummy.png"
          alt="未選曲"
          width={200}
        />
        <p>選曲待機中...</p>
      </>
    );
  }
  else if (selectState === "finished") {
    displayByState = (
      <>
        <img
          src="/jackets/dummy.png"
          alt="選曲終了"
          width={200}
        />
        <p>全曲選曲済み</p>
      </>
    );
  }
  else {
    displayByState = (
      <>
        <img
          src={displaySong.jacket}
          alt={displaySong.title}
          width={200}
        />
        <p>{displaySong.title}</p>
        {song && (
          <p>
            {displaySong.difficulty} {displaySong.level}
          </p>
        )}
      </>
    );
  }

  return (
  <div>
    <h1>Otoge Song Randomizer</h1>
    <label>
      <input
        type="checkbox"
        checked={canSelectTwice}
        onChange={(e) => setCanSelectTwice(e.target.checked)}
      />
      一度出た楽曲も選曲する
    </label>
    <p>現在の曲：</p>
    {displayByState}
    <button onClick={selectSong}>
      選曲！
    </button>
    <p></p>
    <button onClick={() => {
      setSong(null);
      setSelectedSongs([]);
      setSelectState("not_started");
    }}>
      選曲済み楽曲をリセット
    </button>
  </div>
  );
}

export default App;