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
            selectState: "division_card" as SelectState
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
      <div className="w-full min-h-screen bg-[url('/images/bg_b4utech.png')] bg-center bg-cover text-white items-center font-sans p-10">
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
  const teamNameA = tournament.teamA.name;
  const teamNameB = tournament.teamB.name;
  const allDivisions = tournament.divisions;
  const currentDivision = allDivisions[numCurrentDivision];
  const currentDivisionTitle = currentDivision.gameTitle;
  const currentRound = currentDivision.rounds[numCurrentRound];
  const currentRoundName = currentRound.name;
  const currentSongs = currentRound.songs;

  const currentDivisionState = tournamentState?.divisionStates[numCurrentDivision];
  const currentRoundState = currentDivisionState?.roundStates[numCurrentRound];
  const song = currentRoundState.selectedSong;
  const selectedSongs = currentRoundState.selectedSongs;
  const selectState = currentRoundState.selectState;
  const scoresPlayerA = currentRoundState.scoresPlayerA;
  const scoresPlayerB = currentRoundState.scoresPlayerB;

  // セッター
  const {
    setSong,
    setSelectedSongs,
    setSelectState,
    showDivisionCard,
    showRoundCard,
    showRoulette,
    showSelectedSongs,
    selectSong1,
    selectSong2,
    selectSong3,
    setScoresPlayerA,
    setScoresPlayerB,
    showRoundResult,
    previousRound,
    nextRound,
    previousDivision,
    nextDivision,
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

  return (
    <div className="
    w-full min-h-screen
    bg-[url('/images/bg_b4utech.png')] bg-center bg-cover
    text-white font-sans">

      {selectState === "division_card" && (
        <div className="pt-12">
          <div className="
          bg-[url('/images/bg_cardname.png')] bg-contain bg-no-repeat
          w-5xl aspect-[6/1] mx-auto flex items-center justify-center">
            <p className="font-bold text-5xl text-center text-balance">
              {tournament.name} {currentDivisionTitle}部門
            </p>
          </div>
          <div className="flex items-center justify-center pt-8">
            <div className="
            bg-[url('/images/bg_division_card.png')] bg-cover bg-no-repeat
            w-[750px] h-[750px]
            [text-shadow:_0_0_4px_red]">
              <p className="italic font-mono font-bold text-8xl pt-12 pl-30">
                {teamNameA}
              </p>
              <div className="
              flex flex-col gap-[45px] pt-[38px] pl-23
              font-bold text-5xl">
                <p>{currentDivision.rounds[0].playerA.name}</p>
                <p>{currentDivision.rounds[1].playerA.name}</p>
                <p>{currentDivision.rounds[2].playerA.name}</p>
                <p>{currentDivision.rounds[3].playerA.name}</p>
                <p>{currentDivision.rounds[4].playerA.name}</p>
              </div>
            </div>
            <div className="bg-[url('/images/vs.png')] bg-contain bg-no-repeat w-[300px] h-[300px]"></div>
            <div className="
            bg-[url('/images/bg_division_card.png')] bg-cover bg-no-repeat
            w-[750px] h-[750px]
            [text-shadow:_0_0_4px_blue]">
              <p className="italic font-mono font-bold text-8xl pt-12 pl-30">
                {teamNameB}
              </p>
              <div className="
              flex flex-col gap-[45px] pt-[38px] pl-23
              font-bold text-5xl">
                <p>{currentDivision.rounds[0].playerB.name}</p>
                <p>{currentDivision.rounds[1].playerB.name}</p>
                <p>{currentDivision.rounds[2].playerB.name}</p>
                <p>{currentDivision.rounds[3].playerB.name}</p>
                <p>{currentDivision.rounds[4].playerB.name}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {(selectState === "not_started" ||
        selectState === "spinning" ||
        selectState === "displaying" 
      ) && (
        <div className="
        w-full h-screen
        bg-[url('/images/bg_roulette.png')] bg-no-repeat bg-center bg-cover
        flex flex-col items-center justify-center select-none
        [text-shadow:_0_0_10px_purple] font-serif">

          <div className="
          bg-[url('/images/bg_division.png')] bg-no-repeat bg-center bg-contain
          w-[1394px] h-[236px] flex items-center justify-center">
            <p className="
            italic font-thin text-8xl">
              {currentDivisionTitle} 部門
            </p>
          </div>

          <div className="
          bg-[url('images/bg_round.png')] bg-no-repeat bg-center bg-contain
          w-[1188px] h-[161px] flex items-center justify-center">
            <p className="
            italic font-thin text-5xl">
              {currentRoundName}
            </p>
          </div>

          <div className="
          bg-[url('images/bg_selectedSong.png')] bg-no-repeat bg-center bg-contain
          w-[1398px] h-[600px] flex flex-col items-center justify-center
          tracking-widest">
            <SongSelector
              song={song}
            />
          </div>

        </div>)}

      {selectState === "banning" && (
        <div className="pt-12">
          <ShowSelectedSongs
            selectedSongs={selectedSongs}
          />
        </div>
      )}

      {selectState === "showResult" && (
        <ShowRoundResult
          divisionName={currentDivisionTitle}
          round={currentRound}
          roundState={currentRoundState}
          teamNameA={teamNameA}
          teamNameB={teamNameB}
          scoresPlayerA={scoresPlayerA}
          scoresPlayerB={scoresPlayerB}
        />
      )}

      {!isStreamingMode && (
        <ControlPanel
          tournamentState={tournamentState}
          currentRound={currentRound}
          currentRoundState={currentRoundState}
          numCurrentDivision={numCurrentDivision}
          numCurrentRound={numCurrentRound}
          onSelectSong={selectSong}
          onSetSong={setSong}
          onSelectSong1={selectSong1}
          onSelectSong2={selectSong2}
          onSelectSong3={selectSong3}
          scoresPlayerA={scoresPlayerA}
          scoresPlayerB={scoresPlayerB}
          setScoresPlayerA={setScoresPlayerA}
          setScoresPlayerB={setScoresPlayerB}
          onShowSelectedSongs={showSelectedSongs}
          onShowRoundResult={showRoundResult}
          onShowDivisionCard={showDivisionCard}
          onShowRoundCard={showRoundCard}
          onShowRoulette={showRoulette}
          onPrevRound={previousRound}
          onNextRound={nextRound}
          onPrevDivision={previousDivision}
          onNextDivision={nextDivision}
        />
      )}
    </div>

  );
}

export default App;