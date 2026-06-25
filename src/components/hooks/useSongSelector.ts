import { useRef, useEffect } from "react";
import { type Song, type SelectState } from "../types";

let previousSong: Song | null;

type UseSongSelecterProps = {
  availableSongs: Song[];
  setSong: (song: Song | null) => void;
  setSelectState: (selectState: SelectState) => void;
  playClickSound: () => void;
  playFinishSound: () => void;
}

export function useSongSelector({
  availableSongs,
  setSong,
  setSelectState,
  playClickSound,
  playFinishSound,
}: UseSongSelecterProps) {
  

  // 抽選
  const selectSong = () => {
    // 演出用: 直前の選曲を初期化
    previousSong = null;

    // 重複不可時: 抽選可能楽曲が無くなったら終了
    if (availableSongs.length === 0) {
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
        previousSong?.title === tempRandomSong.title
      );

      // "直前の曲"を更新
      previousSong = tempRandomSong;

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
      setSelectState("displaying");
      playFinishSound();
    }, totalDelay);
  };

  return selectSong;
}