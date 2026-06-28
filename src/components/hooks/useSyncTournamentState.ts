// BroadcastChannelで状態を同期させるためのカスタムフック
// useSyncTournamentState: tournamentStateの状態を同期させる
// 以下同様

import { useEffect, useState, useRef } from 'react'
import { type Tournament } from '../types';

// tournamentの状態を同期させるカスタムフック
export function useSyncTournament(initialTournament: Tournament | null) {
    const [tournament, setTournament] = useState<Tournament | null>(initialTournament);
    const channelRef = useRef<BroadcastChannel | null>(null);

    useEffect(() => {
        // BroadcastChannelの作成
        const channel = new BroadcastChannel('tournament_channel');
        channelRef.current = channel;

        // メッセージ受信時の処理
        channel.onmessage = (event) => {
            const receivedTournament: Tournament = event.data;
            setTournament(receivedTournament);
        };

        return () => {
            // コンポーネントがアンマウントされるときにBroadcastChannelを閉じる
            channel.close();
        };
    }, []);

    const updateTournament = (newTournament: Tournament | null) => {
        setTournament(newTournament);
        // BroadcastChannelを通じて他のタブに状態を送信
        channelRef.current?.postMessage(newTournament);
    };

    return [tournament, updateTournament] as const;
}

// tournamentStateの状態を同期させるカスタムフック
export function useSyncTournamentState(initialTournamentState: any) {
    const [tournamentState, setTournamentState] = useState<any>(initialTournamentState);
    const channelRef = useRef<BroadcastChannel | null>(null);

    useEffect(() => {
        // BroadcastChannelの作成
        const channel = new BroadcastChannel('tournament_state_channel');
        channelRef.current = channel;

        // メッセージ受信時の処理
        channel.onmessage = (event) => {
            const receivedTournamentState: any = event.data;
            setTournamentState(receivedTournamentState);
        };

        return () => {
            // コンポーネントがアンマウントされるときにBroadcastChannelを閉じる
            channel.close();
        };
    }, []);

    const updateTournamentState = (newTournamentState: any) => {
        setTournamentState(newTournamentState);
        // BroadcastChannelを通じて他のタブに状態を送信
        channelRef.current?.postMessage(newTournamentState);
    };

    return [tournamentState, updateTournamentState] as const;
}

// numCurrentDivisionの状態を同期させるカスタムフック
export function useSyncNumCurrentDivision(initialNumCurrentDivision: number) {
    const [numCurrentDivision, setNumCurrentDivision] = useState<number>(initialNumCurrentDivision);
    const channelRef = useRef<BroadcastChannel | null>(null);

    useEffect(() => {
        // BroadcastChannelの作成
        const channel = new BroadcastChannel('num_current_division_channel');
        channelRef.current = channel;

        // メッセージ受信時の処理
        channel.onmessage = (event) => {
            const receivedNumCurrentDivision: number = event.data;
            setNumCurrentDivision(receivedNumCurrentDivision);
        };

        return () => {
            // コンポーネントがアンマウントされるときにBroadcastChannelを閉じる
            channel.close();
        };
    }, []);

    const updateNumCurrentDivision = (newNumCurrentDivision: number) => {
        setNumCurrentDivision(newNumCurrentDivision);
        // BroadcastChannelを通じて他のタブに状態を送信
        channelRef.current?.postMessage(newNumCurrentDivision);
    };

    return [numCurrentDivision, updateNumCurrentDivision] as const;
}

// numCurrentRoundの状態を同期させるカスタムフック
export function useSyncNumCurrentRound(initialNumCurrentRound: number) {
    const [numCurrentRound, setNumCurrentRound] = useState<number>(initialNumCurrentRound);
    const channelRef = useRef<BroadcastChannel | null>(null);

    useEffect(() => {
        // BroadcastChannelの作成
        const channel = new BroadcastChannel('num_current_round_channel');
        channelRef.current = channel;

        // メッセージ受信時の処理
        channel.onmessage = (event) => {
            const receivedNumCurrentRound: number = event.data;
            setNumCurrentRound(receivedNumCurrentRound);
        };

        return () => {
            // コンポーネントがアンマウントされるときにBroadcastChannelを閉じる
            channel.close();
        };
    }, []);

    const updateNumCurrentRound = (newNumCurrentRound: number) => {
        setNumCurrentRound(newNumCurrentRound);
        // BroadcastChannelを通じて他のタブに状態を送信
        channelRef.current?.postMessage(newNumCurrentRound);
    };

    return [numCurrentRound, updateNumCurrentRound] as const;
}