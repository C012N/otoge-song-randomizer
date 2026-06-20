import { useEffect, useRef, useState } from "react";

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
  | "spinning"
  | "displaying"
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

  // 演出用、直前に選ばれた楽曲の状態
  const previousSong = useRef<Song | null>(null);


  // 抽選する関数
  const selectSong = () => {
    if (availableSongs.length === 0) {
      setSong(null);
      // 状態の更新
      setSelectState("finished");
      return;
    }
    // ランダムにインデックスを抽選して選曲しておく
    const randomIndex = Math.floor(Math.random() * availableSongs.length);
    const selectedSong = availableSongs[randomIndex];
    setSong(selectedSong);
    // 状態の更新
    setSelectState("spinning");
    // 選曲演出
    // availableSongsから減速しつつランダム選曲しまくる
    const delays = [
      40, 40, 40, 40, 40, 40,
      40, 40, 40, 40, 40, 40,
      40, 40, 40, 40, 40, 40,
      40, 40, 40, 40, 40, 40,
      80, 80, 80, 80, 80, 80,
      80, 80, 80, 80, 80, 80,
      160,160,160,160,160,160,
      320,320,320,
      640];
    const spin = (step: number) => {
      if (step >= delays.length) {
        return;
      }
      let tempRandomSong: Song;
      let tempRandomIndex: number;
      do {
        tempRandomIndex = Math.floor(Math.random() * availableSongs.length);
        tempRandomSong = availableSongs[tempRandomIndex];
      } while (
        availableSongs.length > 1 &&
        previousSong.current?.title === tempRandomSong.title
      );
      previousSong.current = tempRandomSong;
      setSong(tempRandomSong);
      setTimeout(() => {
        spin(step + 1);
      }, delays[step]);
    };
    spin(0);
    // 演出終わり
    const totalDelay = delays.reduce((sum, delay) => sum + delay, 0);
    setTimeout(() => {
      setSong(selectedSong);
      setSelectedSongs(prev => [...prev, selectedSong]);
      setSelectState("displaying");
    }, totalDelay);
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
    <button
      onClick={selectSong}
      disabled={selectState === "spinning"}
    >
      選曲！
    </button>
    <p></p>
    <button onClick={() => {
      setSong(null);
      setSelectedSongs([]);
      setSelectState("not_started");
    }}
    disabled={selectState === "spinning"}>
      選曲済み楽曲をリセット
    </button>
  </div>
  );
}

export default App;