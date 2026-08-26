// webサイトのルートコンポーネント
// 大会データの読み込み、状態管理、URLクエリ取得と分岐を行う

import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import {
  type Tournament,
  type SelectState,
  type TournamentState
} from "./components/types";
import { SongSelector } from "./components/SongSelector";
import { useSongSelector } from "./components/hooks/useSongSelector";
import { ControlPanel } from "./components/ControlPanel";
import { useTournamentState } from "./components/hooks/useTournamentState";
import {
  useSyncTournament,
  useSyncTournamentState,
  useSyncNumCurrentDivision,
  useSyncNumCurrentRound
} from "./components/hooks/useSyncTournamentState";
import "./App.css"
import { loadTournament } from "./components/loadTournament";
import { ShowSelectedSongs } from "./components/ShowSelectedSongs"
import { ShowRoundResult } from "./components/ShowRoundResult";
import { Button } from "./components/TailwindCssDefaults";
import { DivisionCard } from "./components/DivisionCard";
import { RoundCard } from "./components/RoundCard";

function App() {
  // URLクエリの取得
  const [searchParams] = useSearchParams();
  const queryViewMode = searchParams.get("viewmode") || '';
  const isStreamingMode = queryViewMode === "streaming";

  // 大会データ: JSONファイルから読み込んだ静的データ
  const [tournament, setTournament] = useSyncTournament(null);

  // 大会状態: 選曲状態やスコアなど運営の操作によるもの
  const [tournamentState, setTournamentState] = useSyncTournamentState(null);

  // 部門進行状況: 整数値で管理
  const [numCurrentDivision, setNumCurrentDivision] = useSyncNumCurrentDivision(0);

  // 試合進行状況: 整数値で管理
  const [numCurrentRound, setNumCurrentRound] = useSyncNumCurrentRound(0);

  // 抽選演出用: 効果音
  const audioContextClick = useRef<AudioContext | null>(null);
  const audioContextStart = useRef<AudioContext | null>(null);
  const audioContextFinish = useRef<AudioContext | null>(null);
  const startSoundBuffer = useRef<AudioBuffer | null>(null);
  const clickSoundBuffer = useRef<AudioBuffer | null>(null);
  const finishSoundBuffer = useRef<AudioBuffer | null>(null);

  // バッファ生成: クリック音
  useEffect(() => {
    const initAudio = async () => {
      audioContextClick.current = new AudioContext();
      const response = await fetch("sounds/click.mp3");
      const arrayBuffer = await response.arrayBuffer();
      clickSoundBuffer.current =
        await audioContextClick.current.decodeAudioData(arrayBuffer);
    };
    initAudio();
  }, []);

  // バッファ生成: 開始音
  useEffect(() => {
    const initAudio = async () => {
      audioContextStart.current = new AudioContext();
      const response = await fetch("sounds/start.mp3");
      const arrayBuffer = await response.arrayBuffer();
      startSoundBuffer.current =
        await audioContextStart.current.decodeAudioData(arrayBuffer);
    };
    initAudio();
  }, []);

  // バッファ生成: クリック音
  useEffect(() => {
    const initAudio = async () => {
      audioContextFinish.current = new AudioContext();
      const response = await fetch("sounds/finish.mp3");
      const arrayBuffer = await response.arrayBuffer();
      finishSoundBuffer.current =
        await audioContextFinish.current.decodeAudioData(arrayBuffer);
    };
    initAudio();
  }, []);

  // 再生: クリック音
  const playClickSound = () => {
    if (!audioContextClick.current || !clickSoundBuffer.current) return;
    const source = audioContextClick.current.createBufferSource();
    source.buffer = clickSoundBuffer.current;
    source.connect(audioContextClick.current.destination);
    source.start();
  };

  // 再生: 開始音
  const playStartSound = () => {
    if (!audioContextStart.current || !startSoundBuffer.current) return;
    const source = audioContextStart.current.createBufferSource();
    source.buffer = startSoundBuffer.current;
    source.connect(audioContextStart.current.destination);
    source.start();
  };

  // 再生: 終了音
  const playFinishSound = () => {
    if (!audioContextFinish.current || !finishSoundBuffer.current) return;
    const source = audioContextFinish.current.createBufferSource();
    source.buffer = finishSoundBuffer.current;
    source.connect(audioContextFinish.current.destination);
    source.start();
  };

  // ファイルを読み込む
  const onFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      alert("no files found.");
      return;
    }
    try {
      const { tournament } = await loadTournament(file);
      setTournament(tournament);
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
            selectedSongs: [],
            setSongs: [],
            scoresPlayerA: [0, 0, 0],
            scoresPlayerB: [0, 0, 0],
            selectState: "division_card" as SelectState,
            isSongOpened: false
          })),
          scoreTeamA: 0,
          scoreTeamB: 0
        })),
        scoreTeamA: 0,
        scoreTeamB: 0
      }
    }

  // useEffect, useRef, useStateはここより前に書く
  // 読み込み前の画面
  const currentURL = window.location.href;
  if (!tournament || !tournamentState) {
    return (
      <div className="
      w-full min-h-screen
      bg-[url('/images/bg_b4utech.png')] bg-center bg-cover
      text-white items-center font-sans p-10">
        <h1>Otoge Song Randomizer</h1>

        {isStreamingMode && (
          <h2>now loading...</h2>
        )}

        {!isStreamingMode && (
          <h3>1. 配信ビューを開く</h3>
        )}

        {!isStreamingMode && (
          Button({
            children: "配信ビューを開く",
            onClick: () => {
              const streamingURL = currentURL + "?viewmode=streaming";
              window.open(streamingURL, "_blank");
            },
            disabled: false
          })
        )}

        {!isStreamingMode && (
          <h3>2. 大会データを選択</h3>
        )}

        {!isStreamingMode && (
          <input className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
            type="file"
            accept=".json,application/json"
            onChange={onFileSelected}
          />
        )}
      </div>
    );
  }

  // 各データの取得
  const currentDivision = tournament.divisions[numCurrentDivision];
  const currentRound = currentDivision.rounds[numCurrentRound];
  const currentSongs = currentRound.songs;

  const currentDivisionState = tournamentState.divisionStates[numCurrentDivision];
  const currentRoundState = currentDivisionState.roundStates[numCurrentRound];
  const song = currentRoundState.selectedSong;
  const selectedSongs = currentRoundState.selectedSongs;
  const selectState = currentRoundState.selectState;

  // セッター
  const {
    setSong,
    setSelectedSongs,
    setSelectState,
  } = useTournamentState({
    tournament,
    tournamentState,
    setTournamentState,
    numCurrentDivision,
    setNumCurrentDivision,
    numCurrentRound,
    setNumCurrentRound
  });

  // 演出
  const selectSong = useSongSelector({
    currentSongs,
    selectedSongs,
    setSong,
    setSelectedSongs,
    setSelectState,
    playStartSound,
    playClickSound,
    playFinishSound
  });

  const streamingView = () => {
    switch (selectState) {
      case "division_card":
        return <DivisionCard
          tournament={tournament}
          numCurrentDivision={numCurrentDivision}
        />

      case "round_card":
        return <RoundCard
          tournament={tournament}
          numCurrentDivision={numCurrentDivision}
          numCurrentRound={numCurrentRound}
          isSongOpened={currentRoundState.isSongOpened}
        />

      case "banning":
        return <ShowSelectedSongs
          selectedSongs={selectedSongs}
        />

      case "showResult":
        return <ShowRoundResult
          tournament={tournament}
          numCurrentDivision={numCurrentDivision}
          numCurrentRound={numCurrentRound}
          currentRoundState={currentRoundState}
        />

      default:
        return <SongSelector
          tournament={tournament}
          numCurrentDivision={numCurrentDivision}
          numCurrentRound={numCurrentRound}
          song={song}
        />
    }
  }

  const ControlView = () => {
    return <ControlPanel
      tournament={tournament}
      tournamentState={tournamentState}
      setTournamentState={setTournamentState}
      numCurrentDivision={numCurrentDivision}
      setNumCurrentDivision={setNumCurrentDivision}
      numCurrentRound={numCurrentRound}
      setNumCurrentRound={setNumCurrentRound}
      selectSong={selectSong}
    />
  }

  return (
    <div className="
    w-full min-h-screen
    bg-[url('/images/bg_b4utech.png')] bg-center bg-cover
    text-white font-sans">

      {isStreamingMode ? streamingView() : ControlView()}

    </div>)
}

export default App;