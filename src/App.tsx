import { useEffect, useRef, useState } from "react";
import {
  TournamentSchema,
  type Song,
  type Tournament,
  type SelectState,
  type TournamentState
} from "./components/types";
import { SongSelector } from "./components/SongSelector";
import { useSongSelector } from "./components/hooks/useSongSelector";
import { ControlPanel } from "./components/ControlPanel";
import { useTournamentState } from "./components/hooks/useTournamentState";
import { ScoreInput } from "./components/ScoreInput";
import "./App.css"
import { PlayerCard } from "./components/PlayerCard";

function App() {
  // 大会データ
  const [tournament, setTournament] = useState<Tournament | null>(null);

  // 画像データ: ファイル名->URLのmap
  // const [imageMap, setImageMap] = useState<Map<string, string>>(new Map());

  // 部門進行状況: 整数値で管理
  const [numCurrentDivision, setNumCurrentDivision] = useState(0);

  // 試合進行状況: 整数値で管理
  const [numCurrentRound, setNumCurrentRound] = useState(0);

  // 得点状況
  const [tournamentState, setTournamentState] = useState<TournamentState | null>(null);

  // 抽選演出用: 効果音
  const audioContext = useRef<AudioContext | null>(null);
  const clickSoundBuffer = useRef<AudioBuffer | null>(null);
  const finishSound = useRef<HTMLAudioElement | null>(null);

  // バッファ生成: クリック音
  useEffect(() => {
    const initAudio = async () => {
      audioContext.current = new AudioContext();
      const response = await fetch("click.mp3");
      const arrayBuffer = await response.arrayBuffer();
      clickSoundBuffer.current =
        await audioContext.current.decodeAudioData(arrayBuffer);
    };
    initAudio();
  }, []);

  // 生成: 終了音
  useEffect(() => {
    finishSound.current = new Audio("finish.mp3");
    return () => {
      finishSound.current = null;
    };
  }, []);

  // 再生: クリック音
  const playClickSound = () => {
    if (!audioContext.current || !clickSoundBuffer.current) return;
    const source = audioContext.current.createBufferSource();
    source.buffer = clickSoundBuffer.current;
    source.connect(audioContext.current.destination);
    source.start();
  };

  // 再生: 終了音
  const playFinishSound = () => {
    if (!finishSound.current) return;
    finishSound.current.currentTime = 0;
    finishSound.current.play();
  }

  // 大会初期データ
  const createInitialTournamentState =
    (tournament: Tournament): TournamentState => {

      return {
        divisionStates: tournament.divisions.map(division => ({
          roundStates: division.rounds.map(() => ({
            selectedSong: null,
            selectedSongs: [],
            scoresPlayerA: [0, 0, 0],
            scoresPlayerB: [0, 0, 0],
            selectState: "not_started" as SelectState
          })),
          scoreTeamA: 0,
          scoreTeamB: 0
        })),
        scoreTeamA: 0,
        scoreTeamB: 0
      };
    };

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
      setTournamentState(createInitialTournamentState(result.data));

      // 各値の初期化
      setNumCurrentDivision(0);
      setNumCurrentRound(0);
    } catch (e) {
      alert("JSONのパースに失敗しました。ファイル形式を確認してください。");
    }
  };

  // useEffect, useRef, useStateはここより前に書く
  // 読み込み前の画面
  if (!tournament || !tournamentState) {
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

  // 状態もセット
  const currentDivisionState = tournamentState?.divisionStates[numCurrentDivision];
  const currentRoundState = currentDivisionState?.roundStates[numCurrentRound];

  // 状態からデータを取り出しておく
  const song = currentRoundState.selectedSong;
  const selectState = currentRoundState.selectState;
  const scoresPlayerA = currentRoundState.scoresPlayerA;
  const scoresPlayerB = currentRoundState.scoresPlayerB;

  // セッター
  const {
    setSong,
    setSelectState,
    setScoresPlayerA,
    setScoresPlayerB
  } = useTournamentState({
    tournamentState,
    setTournamentState,
    numCurrentDivision,
    numCurrentRound
  });

  // 演出

  const availableSongs = currentSongs;
  const selectSong = useSongSelector({
    availableSongs,
    setSong,
    setSelectState,
    playClickSound,
    playFinishSound
  });


  // 試合の進行
  const previousRound = () => {
    setNumCurrentRound(prev => prev - 1);
  }
  const nextRound = () => {
    setNumCurrentRound(prev => prev + 1);
  };

  // 試合のリセット
  const resetCurrentRound = () => {
    setTournamentState(prev => {
      if (!prev) return prev;

      const next = structuredClone(prev);

      next.divisionStates[numCurrentDivision].roundStates[numCurrentRound] = {
        selectedSong: null,
        selectedSongs: [],
        scoresPlayerA: [0, 0, 0],
        scoresPlayerB: [0, 0, 0],
        selectState: "not_started"
      }

      return next;
    }

    )
  }

  // 部門の進行
  const previousDivision = () => {
    setNumCurrentDivision(prev => prev - 1);
    setNumCurrentRound(0);
  };

  const nextDivision = () => {
    setNumCurrentDivision(prev => prev + 1);
    setNumCurrentRound(0);
  };

  const resetDivision = () => {
    setTournamentState(prev => {
      if (!prev) return prev;

      const next = structuredClone(prev);

      next.divisionStates[numCurrentDivision] = ({
        roundStates: next.divisionStates[numCurrentDivision].roundStates.map(() => ({
          selectedSong: null,
          selectedSongs: [],
          scoresPlayerA: [0, 0, 0],
          scoresPlayerB: [0, 0, 0],
          selectState: "not_started" as SelectState
        })),
        scoreTeamA: 0,
        scoreTeamB: 0
      })

      return next;
    })

    setNumCurrentRound(0);
  }

  // 大会全体のリセット
  const resetTournament = () => {
    setTournamentState(createInitialTournamentState(tournament));
    setNumCurrentDivision(0);
    setNumCurrentRound(0);
  };

  return (
    <div className="app">
      <header className="tournament-header">
        <h1>{tournamentName}</h1>
        <h2>{currentDivisionTitle}部門</h2>
        <h2>{currentRoundName}</h2>
      </header>

      <main className="match-area">

        <PlayerCard
          teamName={teamA.name}
          playerName={currentPlayerA.name}
          selectedSong={currentPlayerA.song}
          scores={scoresPlayerA}
        />

        <div className="vs">VS</div>

        <PlayerCard
          teamName={teamB.name}
          playerName={currentPlayerB.name}
          selectedSong={currentPlayerB.song}
          scores={scoresPlayerB}
        />

      </main>

      <SongSelector
        song={song}
        selectState={selectState}
        onSelect={selectSong}
      />

      <ControlPanel
        tournamentState={tournamentState}
        numCurrentDivision={numCurrentDivision}
        numCurrentRound={numCurrentRound}
        scoresPlayerA={scoresPlayerA}
        scoresPlayerB={scoresPlayerB}
        setScoresPlayerA={setScoresPlayerA}
        setScoresPlayerB={setScoresPlayerB}
        onPrevRound={previousRound}
        onNextRound={nextRound}
        onResetRound={resetCurrentRound}
        onPrevDivision={previousDivision}
        onNextDivision={nextDivision}
        onResetDivision={resetDivision}
        onResetTournament={resetTournament}
      />

    </div>
  );
}

export default App;