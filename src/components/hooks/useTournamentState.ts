import type React from "react";
import { type Song, type SelectState, type TournamentState } from "../types";

type UseTournamentStateProps = {
    tournamentState: TournamentState
    setTournamentState: React.Dispatch<React.SetStateAction<TournamentState | null>>;
    numCurrentDivision: number;
    numCurrentRound: number;
}

export function useTournamentState({
    tournamentState,
    setTournamentState,
    numCurrentDivision,
    numCurrentRound,
}: UseTournamentStateProps) {
    // 補助関数
      const setSong = (song: Song | null) => {
        setTournamentState(prev => {
          if (!prev) return prev;
    
          const next = structuredClone(prev);
    
          next.divisionStates[numCurrentDivision].roundStates[numCurrentRound].selectedSong = song;
    
          return next;
        }
        )
      }
    
      const setSelectState = (state: SelectState) => {
        setTournamentState(prev => {
          if (!prev) return prev;
    
          const next = structuredClone(prev);
    
          next.divisionStates[numCurrentDivision].roundStates[numCurrentRound].selectState = state;
    
          return next;
        })
      }
    
      const setScoresPlayerA = (scores: number[]) => {
        setTournamentState(prev => {
          if (!prev) return prev;
    
          const next = structuredClone(prev);
    
          next.divisionStates[numCurrentDivision].roundStates[numCurrentRound].scoresPlayerA = scores;
    
          return next;
        })
      }
    
      const setScoresPlayerB = (scores: number[]) => {
        setTournamentState(prev => {
          if (!prev) return prev;
    
          const next = structuredClone(prev);
    
          next.divisionStates[numCurrentDivision].roundStates[numCurrentRound].scoresPlayerB = scores;
    
          return next;
        })
      }
      return {setSong, setSelectState, setScoresPlayerA, setScoresPlayerB}
}