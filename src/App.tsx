import { useState } from "react";

function App() {
  // 楽曲の状態
  const [song, setSong] = useState("（なし）");

  // 選曲済み楽曲リストの状態
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);

  // 重複選曲を許すかどうかの状態
  const [canSelectTwice, setCanSelectTwice] = useState(false);

  // 楽曲群の宣言(とりあえずの動作確認用)
  const songs = [
    "Op.I -fear TITΛN-",
    "MarbleBlue",
    "Stardust:RAY",
    "光焔のラテラルアーク",
    "Selenadia"
  ];

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
    setSelectedSongs([
      ...selectedSongs,
      selectedSong
    ]);
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
  </div>
  );
}

export default App;