import { Database } from "./database";

export type TVoting = Database["public"]["Tables"]["votings"]["Row"];
export type TParticipant = Database["public"]["Tables"]["voters"]["Row"];
