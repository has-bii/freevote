import { Database } from "./database";

export type TVoting = Database["public"]["Tables"]["votings"]["Row"];
export type TParticipant = Database["public"]["Tables"]["voters"]["Row"];
export type TChoice = Database["public"]["Tables"]["choices"]["Row"];
export type TSession = Database["public"]["Tables"]["sessions"]["Row"];
