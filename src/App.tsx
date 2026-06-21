import { useEffect, useRef, useState } from "react";

// 楽曲の型
type Song = {
  title: string;
  difficulty: string;
  level: string;
  jacket: string;
};

// ラウンドの型
type Round = {
  name: string;
  songs: Song[];
};

// 抽選状態の型
type SelectState =
  | "not_started"
  | "spinning"
  | "displaying"
  | "finished";

function App() {
  // "楽曲"を表す
  const [song, setSong] = useState<Song | null>(null);
  // "試合全体"を表す
  const [tournament, setTournament] = useState<Round[]>([]);
  // "今の試合"を表す
  const [currentRound, setCurrentRound] = useState(0);
  // "サイトの状態"を表す
  const [selectState, setSelectState] = useState<SelectState>("not_started");
  // 再抽選防止用: 抽選済み楽曲リスト
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  // 再抽選防止の切り換え用: 再抽選を許可するかどうか
  const [canSelectTwice, setCanSelectTwice] = useState(false);
  // 抽選演出用: 直近の抽選楽曲
  const previousSong = useRef<Song | null>(null);

  /*
  // jsonの読み込み
  useEffect(() => {
    fetch("/taikai.json")
      // jsonとして解釈
      .then(response => response.json())
      // 状態に保存
      .then(data => {
        setTournament(data);
      });
  }, []);
  // 書き込み中の処理
  if (tournament.length === 0) {
    return <p>大会データ読み込み中...</p>
  }
  // 各データの取得
  const currentRoundData = tournament[currentRound];
  const currentSongs = currentRoundData.songs;
  */
  // デバッグ用: ログの出力
  // console.log(tournament);
  // console.log(currentRound);
  // console.log(currentRoundData);
  // console.log(currentSongs);

  // jsonを選択して読み込み
  const loadTournament = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setTournament(data);
        setCurrentRound(0);
        setSong(null);
        setSelectedSongs([]);
        setSelectState("not_started");
        previousSong.current = null;
      } catch {
        alert("JSONの読み込みに失敗しました");
      }
    };
    reader.readAsText(file);
  }
  // 読み込み中の処理
  if (tournament.length === 0) {
    return (
      <div>
        <h1>Ptpge Song Randomizer</h1>

        <p>大会データを選択してください</p>

        <input
          type="file"
          accept=".json"
          onChange={loadTournament}
        />
      </div>
    );
  }

  // 各データの取得
  const currentRoundData = tournament[currentRound];
  const currentSongs = currentRoundData.songs;

  // 抽選可能楽曲
  const availableSongs = canSelectTwice ? currentSongs
    : currentSongs.filter(song => !selectedSongs.some(
      selected => selected.title === song.title));

  // 抽選する関数
  const selectSong = () => {
    previousSong.current = null;
    if (availableSongs.length === 0) {
      setSong(null);
      // 状態の更新
      setSelectState("finished");
      return;
    }
    // ランダムにインデックスを抽選して選曲しておく
    const randomIndex = Math.floor(Math.random() * availableSongs.length);
    const selectedSong = availableSongs[randomIndex];
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
      160, 160, 160, 160, 160, 160,
      320, 320, 320,
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

  // 楽曲の描画
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

  // 試合の進行
  const previousRound = () => {
    if (currentRound === 0) {
      setSelectState("not_started");
      return;
    }
    setCurrentRound(prev => prev - 1);
    setSong(null);
    setSelectedSongs([]);
    previousSong.current = null;
    setSelectState("not_started");
  }
  const nextRound = () => {
    if (currentRound >= tournament.length - 1) {
      setSelectState("finished");
      return;
    }
    setCurrentRound(prev => prev + 1);
    setSong(null);
    setSelectedSongs([]);
    previousSong.current = null;
    setSelectState("not_started");
  };

  // 試合全体のリセット
  const resetTournament = () => {
    setCurrentRound(0);
    setSong(null);
    setSelectedSongs([]);
    previousSong.current = null;
    setSelectState("not_started");
  };

  return (
    <div>
      <h1>Otoge Song Randomizer</h1>

      <button
        onClick={previousRound}
        disabled={currentRound === 0}
      >
        前の試合へ
      </button>

      <button
        onClick={selectSong}
        disabled={selectState === "spinning"}
      >
        選曲！
      </button>

      <button
        onClick={nextRound}
        disabled={currentRound === tournament.length - 1}>
        次の試合へ
      </button>


      <p>現在の試合: {currentRoundData.name}</p>

      <p>現在の曲：</p>
      {displayByState}

      <button onClick={() => {
        setSong(null);
        setSelectedSongs([]);
        setSelectState("not_started");
      }}
        disabled={selectState === "spinning"}>
        この試合をリセット
      </button>
      <p></p>
      <button
        onClick={resetTournament}
        disabled={selectState === "spinning"}
      >
        大会全体をリセット
      </button>
      <p></p>
      <label>
        <input
          type="checkbox"
          checked={canSelectTwice}
          onChange={(e) => setCanSelectTwice(e.target.checked)}
        />
        一度出た楽曲も選曲する
      </label>
    </div>
  );
}

export default App;