import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address").unique(),
  gorBalance: integer("gor_balance").default(0),
  gamesPlayed: integer("games_played").default(0),
  gamesWon: integer("games_won").default(0),
});

export const gameRooms = pgTable("game_rooms", {
  id: text("id").primaryKey(),
  hostId: integer("host_id").references(() => users.id),
  maxPlayers: integer("max_players").default(2),
  currentPlayers: integer("current_players").default(1),
  gameState: text("game_state").default("waiting"), // waiting, playing, finished
  gameData: json("game_data"),
  tokenEntry: integer("token_entry").default(5),
  winnerReward: integer("winner_reward").default(50),
  createdAt: timestamp("created_at").defaultNow(),
  startedAt: timestamp("started_at"),
  finishedAt: timestamp("finished_at"),
});

export const gameParticipants = pgTable("game_participants", {
  id: serial("id").primaryKey(),
  roomId: text("room_id").references(() => gameRooms.id),
  userId: integer("user_id").references(() => users.id),
  walletAddress: text("wallet_address"),
  score: integer("score").default(0),
  completedAt: timestamp("completed_at"),
  isWinner: boolean("is_winner").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
});

export const insertGameRoomSchema = createInsertSchema(gameRooms).pick({
  maxPlayers: true,
  tokenEntry: true,
});

export const insertGameParticipantSchema = createInsertSchema(gameParticipants).pick({
  roomId: true,
  userId: true,
  walletAddress: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type GameRoom = typeof gameRooms.$inferSelect;
export type GameParticipant = typeof gameParticipants.$inferSelect;
export type InsertGameRoom = z.infer<typeof insertGameRoomSchema>;
export type InsertGameParticipant = z.infer<typeof insertGameParticipantSchema>;

// Game state interfaces
export interface GameCard {
  id: number;
  type: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface MultiplayerGameState {
  cards: GameCard[];
  players: {
    [playerId: string]: {
      id: string;
      username: string;
      walletAddress: string;
      score: number;
      completedAt?: number;
    };
  };
  currentTurn?: string;
  gameStarted: boolean;
  gameEnded: boolean;
  winner?: string;
  timer: number;
}
