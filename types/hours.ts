export type HourType = {
  id: string;
  quantity: number;
  createdAt: string;
  player: {
    id: string;
    name: string;
  };
};
