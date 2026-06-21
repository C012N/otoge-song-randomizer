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

  // 抽選演出用: 効果音
  const audioContext = useRef<AudioContext | null>(null);
  const clickSoundBuffer = useRef<AudioBuffer | null>(null);

  // バッファ生成: クリック音
  useEffect(() => {
    const initAudio = async () => {
      audioContext.current = new AudioContext();
      const response = await fetch("/click.mp3");
      const arrayBuffer = await response.arrayBuffer();
      clickSoundBuffer.current =
        await audioContext.current.decodeAudioData(arrayBuffer);
    };
    initAudio();
  }, []);

  // 再生: クリック音
  const playClickSound = () => {
    if (!audioContext.current || !clickSoundBuffer.current) return;
    const source = audioContext.current.createBufferSource();
    source.buffer = clickSoundBuffer.current;
    source.connect(audioContext.current.destination);
    source.start();
  };

  const finishSound = useRef<HTMLAudioElement | null>(null);

  // 生成: 終了音
  useEffect(() => {
    finishSound.current = new Audio("finish.mp3");
    return () => {
      finishSound.current = null;
    };
  }, []);

  // 大会フォルダを受け取って処理
  // フォルダを受け取る
  const folderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (folderInputRef.current) {
      folderInputRef.current.setAttribute(
        "webkitdirectory",
        ""
      );
    }
  }, []);

  // フォルダを読み込む
  const loadTournament = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;
    let jsonFile: File | null = null;
    const images = new Map<string, string>();
    for (const file of Array.from(files)) {
      // 今は1つのjsonを仮定
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

  // useEffect, useRef, useStateはここより前に書く
  // 読み込み前の画面
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

  // 重複不可時: 抽選可能楽曲
  const availableSongs = canSelectTwice ? currentSongs
    : currentSongs.filter(song => !selectedSongs.some(
      selected => selected.title === song.title));

  // 抽選
  const selectSong = () => {
    // 演出用: 直前の選曲を初期化
    previousSong.current = null;

    // 重複不可時: 抽選可能楽曲が無くなったら終了
    if (availableSongs.length === 0) {
      setSong(null);
      setSelectState("finished");
      return;
    }

    // 演出前に抽選
    const randomIndex = Math.floor(Math.random() * availableSongs.length);
    const selectedSong = availableSongs[randomIndex];
    
    setSelectState("spinning");

    // 演出: availableSongsからランダム選曲しまくる
    // 抽選間隔
    const delays = [
      40, 40, 40, 40, 40, 40,
      40, 40, 40, 40, 40, 40,
      40, 40, 40, 40, 40, 40,
      40, 40, 40, 40, 40, 40,
      80, 80, 80, 80, 80, 80,
      80, 80, 80, 80, 80, 80,
      160, 160, 160, 160, 160, 160,
      320, 320, 320,
      640
    ];

    // 演出本体
    const spin = (step: number) => {
      // 終了判定
      if (step >= delays.length) {
        return;
      }

      // 演出のためだけに用意
      let tempRandomIndex: number;
      let tempRandomSong: Song;
      
      // 直前の曲と被らないようにランダム選曲
      do {
        tempRandomIndex = Math.floor(Math.random() * availableSongs.length);
        tempRandomSong = availableSongs[tempRandomIndex];
      } while (
        availableSongs.length > 1 &&
        previousSong.current?.title === tempRandomSong.title
      );

      // "直前の曲"を更新
      previousSong.current = tempRandomSong;

      // 選んだ楽曲を表示
      setSong(tempRandomSong);

      // クリック音
      playClickSound();

      // delays[step]ミリ秒待って再帰呼出し
      setTimeout(() => {
        spin(step + 1);
      }, delays[step]);
    };

    // 0ステップ目からスタート
    spin(0);

    // もともと選んであった曲を演出後に表示
    const totalDelay = delays.reduce((sum, delay) => sum + delay, 0);
    setTimeout(() => {
      setSong(selectedSong);
      setSelectedSongs(prev => [...prev, selectedSong]);
      setSelectState("displaying");
      // 終了時の効果音
      if (finishSound.current) {
        finishSound.current.currentTime = 0;
        finishSound.current.play();
      }
    }, totalDelay);
  };

  // null値も自然に描画
  const displaySong = song ?? {
    title: "???",
    difficulty: "???",
    level: "???",
    jacket: "dummy.jpg"
  }

  // プレイヤー名の描画
  const displayPlayers = (players: string[]) => players.join(" vs ");

  // 楽曲の描画を状態ごとに管理
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

  // 試合のリセット
  const resetCurrentRound = () => {
    setSong(null);
    setSelectedSongs([]);
    previousSong.current = null;
    setSelectState("not_started");
  }

  // 大会全体のリセット
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

      <button onClick={resetCurrentRound}
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