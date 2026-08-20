// webサイトのルートコンポーネント
// 大会データの読み込み、状態管理、URLクエリ取得と分岐を行う

import { useEffect, useRef, useState } from "react";
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
import { ShowRoundResult } from "./components/ShowRoundResult";
import { Button } from "./components/TailwindCssDefaults";

function App() {
  // URLクエリの取得
  const [searchParams] = useSearchParams();
  const queryViewMode = searchParams.get("viewmode") || '';
  const isStreamingMode = queryViewMode === "streaming";

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
  const currentURL = window.location.href;
  if (!tournament || !tournamentState) {
    return (
      <div className="w-full min-h-screen bg-[url('/public/bg_b4utech.png')] bg-center bg-cover text-white items-center font-sans p-10">
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
            multiple
            ref={folderInputRef}
            onChange={onFolderSelected}
          />
        )}
      </div>
    );
  }

  // 各データの取得
  // const tournamentName = tournament.name;
  const teamNameA = tournament.teamA.name;
  const teamNameB = tournament.teamB.name;
  const allDivisions = tournament.divisions;
  const currentDivision = allDivisions[numCurrentDivision];
  const currentDivisionTitle = currentDivision.gameTitle;
  const currentRound = currentDivision.rounds[numCurrentRound];
  const currentRoundName = currentRound.name;
  // const currentRoundJudge = currentRound.judge;
  // const currentPlayerA = currentRound.playerA;
  // const currentPlayerB = currentRound.playerB;
  const currentSongs = currentRound.songs;

  const currentDivisionState = tournamentState?.divisionStates[numCurrentDivision];
  const currentRoundState = currentDivisionState?.roundStates[numCurrentRound];
  const song = currentRoundState.selectedSong;
  const selectState = currentRoundState.selectState;
  const scoresPlayerA = currentRoundState.scoresPlayerA;
  const scoresPlayerB = currentRoundState.scoresPlayerB;

  // const playedSongs = [songPlayerA, songPlayerB, song];

  // セッター
  const {
    setSong,
    setSelectState,
    setScoresPlayerA,
    setScoresPlayerB,
    showRoundResult,
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
    playStartSound,
    playClickSound,
    playFinishSound
  });

  return (
    <div className="
    min-h-screen w-full
    bg-[url('/public/bg_b4utech.png')] bg-center bg-cover
    text-white font-sans">

      {(selectState !== "showResult") && (
        <div className="
        w-screen h-screen
        bg-[url('/bg_roulette.png')] bg-no-repeat bg-center bg-cover
        flex flex-col items-center justify-center select-none
        [text-shadow:_0_0_10px_purple] font-serif">

          <div className="
          bg-[url('/bg_division.png')] bg-no-repeat bg-center bg-contain
          w-[1394px] h-[236px] flex items-center justify-center">
            <p className="
            italic font-thin text-8xl">
              {currentDivisionTitle} 部門
            </p>
          </div>

          <div className="
          bg-[url('/bg_round.png')] bg-no-repeat bg-center bg-contain
          w-[1188px] h-[161px] flex items-center justify-center">
            <p className="
            italic font-thin text-5xl">
              {currentRoundName}
            </p>
          </div>

          <div className="
          bg-[url('/bg_selectedSong.png')] bg-no-repeat bg-center bg-contain
          w-[1398px] h-[600px] flex flex-col items-center justify-center
          tracking-widest">
            <SongSelector
              song={song}
            />
          </div>

        </div>)}

      {selectState === "showResult" && (
        <ShowRoundResult
          divisionName={currentDivisionTitle}
          round={currentRound}
          roundState={currentRoundState}
          teamNameA={teamNameA}
          teamNameB={teamNameB}
          imageMap={imageMap}
          scoresPlayerA={scoresPlayerA}
          scoresPlayerB={scoresPlayerB}
        />
      )}

      {!isStreamingMode && (
        <ControlPanel
          tournamentState={tournamentState}
          currentRound={currentRound}
          numCurrentDivision={numCurrentDivision}
          numCurrentRound={numCurrentRound}
          onSelectSong={selectSong}
          scoresPlayerA={scoresPlayerA}
          scoresPlayerB={scoresPlayerB}
          setScoresPlayerA={setScoresPlayerA}
          setScoresPlayerB={setScoresPlayerB}
          onShowRoundResult={showRoundResult}
          onPrevRound={previousRound}
          onNextRound={nextRound}
          onPrevDivision={previousDivision}
          onNextDivision={nextDivision}
          onResetTournament={resetTournament}
        />
      )}
    </div>

  );
}

export default App;