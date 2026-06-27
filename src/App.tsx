import { useEffect, useRef, useState } from "react";
import {
  type Tournament,
  type SelectState,
  type TournamentState
} from "./components/types";
import { SongSelector } from "./components/SongSelector";
import { useSongSelector } from "./components/hooks/useSongSelector";
import { ControlPanel } from "./components/ControlPanel";
import { useTournamentState } from "./components/hooks/useTournamentState";
import "./App.css"
import { PlayerCard } from "./components/PlayerCard";
import { loadTournament } from "./components/loadTournament";

type ViewMode = "operator" | "stream";

type SharedTournamentState = {
  tournament: Tournament | null;
  imageMap: Array<[string, string]>;
  numCurrentDivision: number;
  numCurrentRound: number;
  tournamentState: TournamentState | null;
  updatedAt: number;
};

const STORAGE_KEY = "otoge-song-randomizer-shared-state";
const CHANNEL_NAME = "otoge-song-randomizer-sync";

function App() {
  // 大会データ
  const [tournament, setTournament] = useState<Tournament | null>(null);

  // 画像データ: ファイル名->URLのmap
  const [imageMap, setImageMap] = useState<Map<string, string>>(new Map());
  console.log(imageMap);

  // 部門進行状況: 整数値で管理
  const [numCurrentDivision, setNumCurrentDivision] = useState(0);

  // 試合進行状況: 整数値で管理
  const [numCurrentRound, setNumCurrentRound] = useState(0);

  // 得点状況
  const [tournamentState, setTournamentState] = useState<TournamentState | null>(null);

  // 表示モード
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "operator";
    const params = new URLSearchParams(window.location.search);
    return params.get("view") === "stream" ? "stream" : "operator";
  });
  const [hydrated, setHydrated] = useState(false);

  const channelRef = useRef<BroadcastChannel | null>(null);
  const remoteApplyRef = useRef(false);
  const lastSerializedRef = useRef<string | null>(null);
  const lastSyncedAtRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    params.set("view", viewMode);
    const nextUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", nextUrl);
  }, [viewMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedState = window.localStorage.getItem(STORAGE_KEY);
      if (!storedState) {
        setHydrated(true);
        return;
      }

      const parsedState = JSON.parse(storedState) as SharedTournamentState;
      setTournament(parsedState.tournament);
      setTournamentState(parsedState.tournamentState);
      setImageMap(new Map(parsedState.imageMap));
      setNumCurrentDivision(parsedState.numCurrentDivision ?? 0);
      setNumCurrentRound(parsedState.numCurrentRound ?? 0);
      lastSyncedAtRef.current = parsedState.updatedAt ?? null;
      lastSerializedRef.current = storedState;
    } catch {
      // 破損した保存データは無視する
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;

    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    const handleMessage = (event: MessageEvent<SharedTournamentState>) => {
      const payload = event.data;
      if (!payload) return;

      if (lastSyncedAtRef.current && payload.updatedAt <= lastSyncedAtRef.current) {
        return;
      }

      lastSyncedAtRef.current = payload.updatedAt;
      remoteApplyRef.current = true;
      setTournament(payload.tournament);
      setTournamentState(payload.tournamentState);
      setImageMap(new Map(payload.imageMap));
      setNumCurrentDivision(payload.numCurrentDivision ?? 0);
      setNumCurrentRound(payload.numCurrentRound ?? 0);
      lastSerializedRef.current = JSON.stringify(payload);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;

      try {
        const parsedState = JSON.parse(event.newValue) as SharedTournamentState;
        if (lastSyncedAtRef.current && parsedState.updatedAt <= lastSyncedAtRef.current) {
          return;
        }

        lastSyncedAtRef.current = parsedState.updatedAt;
        remoteApplyRef.current = true;
        setTournament(parsedState.tournament);
        setTournamentState(parsedState.tournamentState);
        setImageMap(new Map(parsedState.imageMap));
        setNumCurrentDivision(parsedState.numCurrentDivision ?? 0);
        setNumCurrentRound(parsedState.numCurrentRound ?? 0);
        lastSerializedRef.current = event.newValue;
      } catch {
        // ignore malformed shared state
      }
    };

    channel.addEventListener("message", handleMessage);
    window.addEventListener("storage", handleStorage);

    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
      window.removeEventListener("storage", handleStorage);
    };
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;

    if (remoteApplyRef.current) {
      remoteApplyRef.current = false;
      return;
    }

    const payload: SharedTournamentState = {
      tournament,
      imageMap: Array.from(imageMap.entries()),
      numCurrentDivision,
      numCurrentRound,
      tournamentState,
      updatedAt: Date.now(),
    };

    const serialized = JSON.stringify(payload);
    if (lastSerializedRef.current === serialized) return;

    lastSerializedRef.current = serialized;
    lastSyncedAtRef.current = payload.updatedAt;
    window.localStorage.setItem(STORAGE_KEY, serialized);
    channelRef.current?.postMessage(payload);
  }, [hydrated, tournament, imageMap, numCurrentDivision, numCurrentRound, tournamentState]);

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
  const onFolderSelected = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) {
      alert("no files found.");
      return;
    }
    try {
      const { tournament, imageMap } = await loadTournament(files);
      setTournament(tournament);
      setImageMap(imageMap);
      setTournamentState(createInitialTournamentState(tournament));
    } catch (err) {
      if (err instanceof Error) alert(err.message);
    }
  }

  // 大会初期状態
  const createInitialTournamentState =
    (tournament: Tournament): TournamentState => {
      return {
        divisionStates: tournament.divisions.map(division => ({
          roundStates: division.rounds.map(() => ({
            selectedSong: null,
            setSongs: [],
            scoresPlayerA: [0, 0, 0],
            scoresPlayerB: [0, 0, 0],
            selectState: "not_started" as SelectState
          })),
          scoreTeamA: 0,
          scoreTeamB: 0
        })),
        scoreTeamA: 0,
        scoreTeamB: 0
      }
    }

  console.log(tournament);
  console.log(tournamentState);

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
          onChange={onFolderSelected}
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
    setScoresPlayerB,
    previousRound,
    nextRound,
    resetCurrentRound,
    previousDivision,
    nextDivision,
    resetDivision,
    resetTournament,
  } = useTournamentState({
    tournament,
    tournamentState,
    setTournamentState,
    createInitialTournamentState,
    numCurrentDivision,
    setNumCurrentDivision,
    numCurrentRound,
    setNumCurrentRound
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




  return (
    <div className="app">
      <header className="tournament-header">
        <div className="view-toggle" role="tablist" aria-label="表示モード">
          <button
            type="button"
            className={`view-toggle__button ${viewMode === "operator" ? "is-active" : ""}`}
            onClick={() => setViewMode("operator")}
          >
            運営向け
          </button>
          <button
            type="button"
            className={`view-toggle__button ${viewMode === "stream" ? "is-active" : ""}`}
            onClick={() => setViewMode("stream")}
          >
            配信向け
          </button>
        </div>

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

      {viewMode === "operator" && (
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
      )}

    </div>
  );
}

export default App;