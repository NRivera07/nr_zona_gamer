export type PlayerType = {
  id: string;
  name: string;
  phone: string;
  email: string;

  assignedConsole?: {
    id: string;
    name: string;
    code: string;
  } | null;

  hours?: {
    id: string;
    playerId: string;
    quantity: number;
    createdAt: Date;
  }[];
};
