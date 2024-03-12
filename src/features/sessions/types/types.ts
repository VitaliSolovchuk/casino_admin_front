export interface SessionEvent {
  actionType: string;
  dataTime: string;
  amountBet: number;
  amountWin: number;
}
export interface getSessionsProps {
  sessionId: string | null
}
