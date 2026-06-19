import { useEffect, useState } from "react";

function App() {
  // 楽曲の状態
  const [song, setSong] = useState("（なし）");

  // 選曲済み楽曲リストの状態
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);

  // 重複選曲を許すかどうかの状態
  const [canSelectTwice, setCanSelectTwice] = useState(false);

  // 楽曲リスト.jsonの読み込み
  // 状態の用意
  const [songs, setSongs] = useState<string[]>([]);
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
  : songs.filter(song => !selectedSongs.includes(song));

  // 抽選する関数
  const selectSong = () => {
    if (availableSongs.length === 0) {
      setSong("全曲抽選済みです");
      return;
    }
    // ランダムにインデックスを抽選して選曲
    const randomIndex = Math.floor(Math.random() * availableSongs.length);
    const selectedSong = availableSongs[randomIndex];
    setSong(selectedSong);
    // 抽選済み楽曲リストに追加
    setSelectedSongs(prev => [...prev, selectedSong]);
  };

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
    <p>{song}</p>
    <button onClick={selectSong}>
      選曲！
    </button>
    <p></p>
    <button onClick={() => {
      setSong("なし");
      setSelectedSongs([]);
    }}>
      選曲済み楽曲をリセット
    </button>
  </div>
  );
}

export default App;