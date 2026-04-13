export type ConsoleType = {
  id: string;
  name: string;
  code: string;
  status?: string;
  assignedPlayer?: {
    id: string;
    name: string;
    phone: string;
    consoleId: string | null;
  } | null;
};
