import { useEffect, useRef, useState } from "react";

// 楽曲の型
type Song = {
  title: string;
  difficulty: string;
  level: string;
  jacket: string;
};

// 試合の型
type Round = {
  name: string;
  players: string[];
  songs: Song[];
};

// 大会全体の型
type Tournament = {
  name: string;
  rounds: Round[];
};

// 抽選状態の型
type SelectState =
  | "not_started"
  | "spinning"
  | "displaying"
  | "finished";

function App() {
  // 大会データ
  const [tournament, setTournament] = useState<Tournament | null>(null);
  // ジャケット画像データ: ファイル名->URLのmap
  const [imageMap, setImageMap] = useState<Map<string, string>>(new Map());
  // 進行状況: 整数値で管理
  const [numCurrentRound, setNumCurrentRound] = useState(0);
  // 表示中の楽曲
  const [song, setSong] = useState<Song | null>(null);
  // 抽選状態
  const [selectState, setSelectState] = useState<SelectState>("not_started");
  // 重複防止用: 抽選済み楽曲リスト
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  // 重複防止用: オプション
  const [canSelectTwice, setCanSelectTwice] = useState(false);
  // 抽選演出用: 直近の抽選楽曲
  const previousSong = useRef<Song | null>(null);

  // 大会フォルダ読み込み用
  const folderInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (folderInputRef.current) {
      folderInputRef.current.setAttribute(
        "webkitdirectory",
        ""
      );
    }
  }, []);

  // jsonを選択して読み込み
  /*
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
        setNumCurrentRound(0);
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
  */

  const loadTournament = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;
    let jsonFile: File | null = null;
    const images = new Map<string, string>();
    for (const file of Array.from(files)) {
      if (file.name.endsWith(".json")) {
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
      alert("tournament.json が見つかりません");
      return;
    }
    try {
      const text = await jsonFile.text();
      const data: Tournament = JSON.parse(text);
      setTournament(data);
      setImageMap(images);
      setNumCurrentRound(0);
      setSong(null);
      setSelectedSongs([]);
      setSelectState("not_started");
      previousSong.current = null;
    } catch {
      alert("JSONの読み込みに失敗しました");
    }
  };

  // 読み込み中の処理
  if (!tournament) {
    return (
      <div>
        <h1>Otoge Song Randomizer</h1>

        <p>大会データを選択してください</p>

        <input
          type="file"
          multiple
          ref={folderInputRef}
          onChange={loadTournament}
        />
      </div>
    );
  }

  // 各データの取得
  const tournamentName = tournament.name;
  const allRounds = tournament.rounds;
  const currentRound = allRounds[numCurrentRound];
  const currentRoundName = currentRound.name;
  const currentPlayers = currentRound.players;
  const currentSongs = currentRound.songs;

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
    jacket: "dummy.jpg"
  }

  // プレイヤー名の描画
  const displayPlayers = (players: string[]) => players.join(" vs ");

  // 楽曲の描画
  let displayByState;
  if (selectState === "not_started") {
    displayByState = (
      <>
        <img
          src="dummy.jpg"
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
          src="dummy.jpg"
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
          src={imageMap.get(displaySong.jacket)}
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
    if (numCurrentRound === 0) {
      setSelectState("not_started");
      return;
    }
    setNumCurrentRound(prev => prev - 1);
    setSong(null);
    setSelectedSongs([]);
    previousSong.current = null;
    setSelectState("not_started");
  }
  const nextRound = () => {
    if (numCurrentRound >= allRounds.length - 1) {
      setSelectState("finished");
      return;
    }
    setNumCurrentRound(prev => prev + 1);
    setSong(null);
    setSelectedSongs([]);
    previousSong.current = null;
    setSelectState("not_started");
  };

  // 試合全体のリセット
  const resetTournament = () => {
    setNumCurrentRound(0);
    setSong(null);
    setSelectedSongs([]);
    previousSong.current = null;
    setSelectState("not_started");
  };

  return (
    <div>
      <h1>{tournamentName}</h1>
      <h2>現在の試合: {currentRoundName}</h2>
      <h2>{displayPlayers(currentPlayers)}</h2>

      <button
        onClick={selectSong}
        disabled={selectState === "spinning"}
      >
        選曲！
      </button>

      <p>現在の曲：</p>
      {displayByState}

      <button
        onClick={previousRound}
        disabled={numCurrentRound === 0}
      >
        前の試合へ
      </button>

      <button
        onClick={nextRound}
        disabled={numCurrentRound === allRounds.length - 1}>
        次の試合へ
      </button>

      <p></p>

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