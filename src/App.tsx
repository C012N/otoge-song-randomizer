// webサイトのルートコンポーネント
// 大会データの読み込み、状態管理、ルーティングを行う

import { useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
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
import { PlayerCard } from "./components/PlayerCard";
import { loadTournament } from "./components/loadTournament";

function App() {
  // 大会データ: JSONファイルから読み込んだ静的データ
  const [tournament, setTournament] = useSyncTournament(null);

  // 大会状態: 選曲状態やスコアなど運営の操作によるもの
  const [tournamentState, setTournamentState] = useSyncTournamentState(null);

  // 画像データ: ファイル名->URLのmap
  const [imageMap, setImageMap] = useState<Map<string, string>>(new Map());
  console.log("dummy", imageMap);

  // 部門進行状況: 整数値で管理
  const [numCurrentDivision, setNumCurrentDivision] = useSyncNumCurrentDivision(0);

  // 試合進行状況: 整数値で管理
  const [numCurrentRound, setNumCurrentRound] = useSyncNumCurrentRound(0);

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

  // useEffect, useRef, useStateはここより前に書く
  // 読み込み前の画面
  if (!tournament || !tournamentState) {
    return (
      <div>
        <h1>Otoge Song Randomizer</h1>

        <p>大会データを選択してください</p>

        {(<input
          type="file"
          multiple
          ref={folderInputRef}
          onChange={onFolderSelected}
        />)}
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

  const currentDivisionState = tournamentState?.divisionStates[numCurrentDivision];
  const currentRoundState = currentDivisionState?.roundStates[numCurrentRound];
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
    previousDivision,
    nextDivision,
    resetTournament
  } = useTournamentState({
    tournament,
    setTournament,
    tournamentState,
    setTournamentState,
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
    <>
      <Routes location={window.location} key={window.location.pathname}>
        <Route path="/otoge-song-randomizer/" element={
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
            />

          </div>
        } />

        <Route path="/otoge-song-randomizer/control" element={
          <ControlPanel
            tournamentState={tournamentState}
            numCurrentDivision={numCurrentDivision}
            numCurrentRound={numCurrentRound}
            onSelectSong={selectSong}
            scoresPlayerA={scoresPlayerA}
            scoresPlayerB={scoresPlayerB}
            setScoresPlayerA={setScoresPlayerA}
            setScoresPlayerB={setScoresPlayerB}
            onPrevRound={previousRound}
            onNextRound={nextRound}
            onPrevDivision={previousDivision}
            onNextDivision={nextDivision}
            onResetTournament={resetTournament}
          />
        } />
      </Routes>
    </>
  );
}

export default App;