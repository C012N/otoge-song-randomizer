import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import "./App.css"

// 楽曲データ
const SongSchema = z.object({
  title: z.string(),
  difficulty: z.string(),
  level: z.string(),
});

// 選手データ
const PlayerSchema = z.object({
  name: z.string(),
  song: SongSchema,
});

// 団体データ
const TeamSchema = z.object({
  name: z.string(),
});

// 試合データ
const RoundSchema = z.object({
  name: z.string(),
  playerA: PlayerSchema,
  playerB: PlayerSchema,
  songs: z.array(SongSchema),
});

// 部門データ
const DivisionSchema = z.object({
  gameTitle: z.string(),
  rounds: z.array(RoundSchema),
});

// 大会データ
const TournamentSchema = z.object({
  name: z.string(),
  teamA: TeamSchema,
  teamB: TeamSchema,
  divisions: z.array(DivisionSchema),
});

// 型定義の自動生成
type Song = z.infer<typeof SongSchema>;
type Tournament = z.infer<typeof TournamentSchema>;

// 抽選状態の型
type SelectState =
  | "not_started"
  | "spinning"
  | "displaying"
  | "finished";

function App() {
  // 大会データ
  const [tournament, setTournament] = useState<Tournament | null>(null);

  // 画像データ: ファイル名->URLのmap
  const [imageMap, setImageMap] = useState<Map<string, string>>(new Map());

  // 部門進行状況: 整数値で管理
  const [numCurrentDivision, setNumCurrentDivision] = useState(0);

  // 試合進行状況: 整数値で管理
  const [numCurrentRound, setNumCurrentRound] = useState(0);

  // 選手の得点
  const [scorePlayerA, setScorePlayerA] = useState(0);
  const [scorePlayerB, setScorePlayerB] = useState(0);

  // チームの勝敗
  const [winner, setWinner] = useState(0);

  // 表示中の楽曲
  const [song, setSong] = useState<Song | null>(null);

  // 抽選状態
  const [selectState, setSelectState] = useState<SelectState>("not_started");

  // 重複防止用: 抽選済み楽曲リスト
  const [songs, setsongs] = useState<Song[]>([]);

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
      if (file.name.endsWith(".json")) {
        // 複数のjsonを含むならアラート
        if (jsonFile) {
          alert("JSONファイルはただ一つ含めてください")
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
      alert("tournament.json が見つかりません");
      return;
    }
    try {
      const text = await jsonFile.text();
      const rawData = JSON.parse(text);

      // ここでバリデーションチェック
      const result = TournamentSchema.safeParse(rawData);

      // 型の異なるJSONにアラート
      if (!result.success) {
        console.error(result.error);
        alert("JSONのフォーマットが正しくありません。\nエラー詳細: " + result.error.message);
        return;
      }

      // tournamentにデータを入れる
      setTournament(result.data);

      // 各値の初期化
      setNumCurrentDivision(0);
      setNumCurrentRound(0);
      setSong(null);
      setSelectState("not_started");
      setsongs([]);
    } catch (e) {
      alert("JSONのパースに失敗しました。ファイル形式を確認してください。");
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
  const teamA = tournament.teamA;
  const teamB = tournament.teamB;
  const allDivisions = tournament.divisions;
  const currentDivision = allDivisions[numCurrentDivision];
  const currentDivisionTitle = currentDivision.gameTitle;
  const currentRound = currentDivision.rounds[numCurrentRound];
  const currentRoundName = currentRound.name;
  const currentPlayerA = currentRound.playerA;
  const currentPlayerB = currentRound.playerB;
  const currentSongs = currentRound.songs;

  // 重複不可時: 抽選可能楽曲
  const availableSongs = canSelectTwice ? currentSongs
    : currentSongs.filter(song => !songs.some(
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
    const song = availableSongs[randomIndex];

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
      setSong(song);
      setsongs(prev => [...prev, song]);
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
    level: "???"
  };

  // 楽曲の描画を状態ごとに管理
  let displaySongByState;

  if (selectState === "not_started") {
    displaySongByState = (
      <>
        <h3>{displaySong.title}</h3>
        <p>選曲待機中...</p>
      </>
    );
  }
  else if (selectState === "finished") {
    displaySongByState = (
      <>
        <h3>{displaySong.title}</h3>
        <p>全曲選曲済み</p>
      </>
    );
  }
  else {
    displaySongByState = (
      <>
        <h3>{displaySong.title}</h3>
        <p>
          {displaySong.difficulty} {displaySong.level}
        </p>
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
    setsongs([]);
    previousSong.current = null;
    setSelectState("not_started");
  }
  const nextRound = () => {
    if (numCurrentRound >= currentDivision.rounds.length - 1) {
      return;
    }
    setNumCurrentRound(prev => prev + 1);
    setSong(null);
    setsongs([]);
    previousSong.current = null;
    setSelectState("not_started");
  };

  // 試合のリセット
  const resetCurrentRound = () => {
    setSong(null);
    setsongs([]);
    previousSong.current = null;
    setSelectState("not_started");
  }

  // 部門の進行
  const previousDivision = () => {
    if (numCurrentDivision === 0) {
      return;
    }
    setNumCurrentDivision(prev => prev - 1);
    setNumCurrentRound(0);
    setSong(null);
    setsongs([]);
    previousSong.current = null;
    setSelectState("not_started");
  };

  const nextDivision = () => {
    if (numCurrentDivision >= allDivisions.length) {
      return;
    }
    setNumCurrentDivision(prev => prev + 1);
    setNumCurrentRound(0);
    setSong(null);
    setsongs([]);
    previousSong.current = null;
    setSelectState("not_started");
  };

  // 大会全体のリセット
  const resetTournament = () => {
    setNumCurrentDivision(0);
    setNumCurrentRound(0);
    setSong(null);
    setsongs([]);
    previousSong.current = null;
    setSelectState("not_started");
  };

  return (
    <div className="app">
      <header className="tournament-header">
        <h1>{tournamentName}</h1>
        <h2>{currentDivisionTitle}部門</h2>
        <h2>{currentRoundName}</h2>
      </header>

      <main className="match-area">
        <section className="player-area">
          <h2>{teamA.name}</h2>

          <p>{currentPlayerA.name}</p>

          <p>自選曲:</p>

          <p>{currentPlayerA.song.title}</p>

          <p>{currentPlayerA.song.difficulty}</p>

          <p>Lv. {currentPlayerA.song.level}</p>
        </section>

        <div className="vs">VS</div>

        <section className="player-area">
          <h2>{teamB.name}</h2>

          <p>{currentPlayerB.name}</p>

          <p>自選曲:</p>

          <p>{currentPlayerB.song.title}</p>

          <p>{currentPlayerB.song.difficulty}</p>

          <p>Lv. {currentPlayerB.song.level}</p>
        </section>
      </main>

      <h2>課題曲:</h2>

      <button
        onClick={selectSong}
        disabled={selectState === "spinning"}
      >
        選曲！
      </button>

      <p>{displaySongByState}</p>

      <button
        onClick={previousRound}
        disabled={numCurrentRound === 0
          || selectState === "spinning"}
      >
        前の試合へ
      </button>

      <button
        onClick={nextRound}
        disabled={numCurrentRound === currentDivision.rounds.length - 1
          || selectState === "spinning"}>
        次の試合へ
      </button>

      <p></p>

      <button onClick={resetCurrentRound}
        disabled={selectState === "spinning"}>
        この試合をリセット
      </button>

      <p></p>

      <button
        onClick={previousDivision}
        disabled={numCurrentDivision === 0
          || selectState === "spinning"}
      >
        前の部門へ
      </button>

      <button
        onClick={nextDivision}
        disabled={numCurrentDivision === allDivisions.length - 1
          || selectState === "spinning"}
      >
        次の部門へ
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