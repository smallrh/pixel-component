/**
 * Mock data for Pixel Admin Dashboard
 */

export interface User {
  id: number;
  name: string;
  email: string;
  role: "Administrator" | "Editor" | "Viewer" | "Developer";
  status: "active" | "pending" | "disabled";
  orders: number;
  createdAt: string;
  avatar?: string;
}

export interface Activity {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
  status: "success" | "warning" | "error" | "info";
}

export interface Order {
  id: string;
  user: string;
  product: string;
  amount: number;
  status: "completed" | "pending" | "failed" | "cancelled";
  date: string;
}

export const mockUsers: User[] = [
  { id: 1001, name: "PixelMaster", email: "pixel@example.com", role: "Administrator", status: "active", orders: 128, createdAt: "2026-08-01" },
  { id: 1002, name: "RetroGamer", email: "retro@example.com", role: "Editor", status: "active", orders: 89, createdAt: "2026-08-05" },
  { id: 1003, name: "PixelArtist", email: "artist@example.com", role: "Developer", status: "pending", orders: 45, createdAt: "2026-08-10" },
  { id: 1004, name: "GameMaster", email: "gm@example.com", role: "Administrator", status: "active", orders: 234, createdAt: "2026-07-15" },
  { id: 1005, name: "SpriteHero", email: "sprite@example.com", role: "Viewer", status: "disabled", orders: 12, createdAt: "2026-08-12" },
  { id: 1006, name: "8BitWarrior", email: "warrior@example.com", role: "Editor", status: "active", orders: 67, createdAt: "2026-08-08" },
  { id: 1007, name: "PixelKnight", email: "knight@example.com", role: "Developer", status: "active", orders: 156, createdAt: "2026-07-28" },
  { id: 1008, name: "ArcadeKing", email: "arcade@example.com", role: "Administrator", status: "pending", orders: 312, createdAt: "2026-07-20" },
  { id: 1009, name: "NESMaster", email: "nes@example.com", role: "Viewer", status: "active", orders: 23, createdAt: "2026-08-15" },
  { id: 1010, name: "ChronoTrigger", email: "chrono@example.com", role: "Editor", status: "disabled", orders: 78, createdAt: "2026-06-30" },
  { id: 1011, name: "ZeldaHero", email: "zelda@example.com", role: "Developer", status: "active", orders: 198, createdAt: "2026-07-05" },
  { id: 1012, name: "MarioPlumber", email: "mario@example.com", role: "Administrator", status: "active", orders: 445, createdAt: "2026-06-15" },
  { id: 1013, name: "SonicSpeed", email: "sonic@example.com", role: "Viewer", status: "pending", orders: 34, createdAt: "2026-08-18" },
  { id: 1014, name: "PacManGhost", email: "pacman@example.com", role: "Editor", status: "active", orders: 92, createdAt: "2026-08-03" },
  { id: 1015, name: "TetrisBlock", email: "tetris@example.com", role: "Developer", status: "active", orders: 167, createdAt: "2026-07-10" },
];

export const mockActivities: Activity[] = [
  { id: 1, user: "PixelMaster", action: "Created user", target: "NewAdmin", time: "2 min ago", status: "success" },
  { id: 2, user: "GameMaster", action: "Updated order", target: "#ORD-2341", time: "5 min ago", status: "info" },
  { id: 3, user: "RetroGamer", action: "Deleted item", target: "Product #89", time: "12 min ago", status: "warning" },
  { id: 4, user: "ArcadeKing", action: "System alert", target: "Storage 92% full", time: "15 min ago", status: "error" },
  { id: 5, user: "PixelKnight", action: "Logged in", target: "Dashboard", time: "20 min ago", status: "info" },
  { id: 6, user: "ZeldaHero", action: "Completed task", target: "Migration", time: "25 min ago", status: "success" },
  { id: 7, user: "MarioPlumber", action: "Created order", target: "#ORD-2342", time: "30 min ago", status: "success" },
];

export const mockOrders: Order[] = [
  { id: "ORD-2341", user: "PixelMaster", product: "Pixel Sword", amount: 99.99, status: "completed", date: "2026-08-20" },
  { id: "ORD-2342", user: "MarioPlumber", product: "Mushroom Kingdom Pass", amount: 299.99, status: "pending", date: "2026-08-20" },
  { id: "ORD-2343", user: "SonicSpeed", product: "Speed Boost DLC", amount: 49.99, status: "completed", date: "2026-08-19" },
  { id: "ORD-2344", user: "TetrisBlock", product: "Block Bundle", amount: 149.99, status: "failed", date: "2026-08-19" },
  { id: "ORD-2345", user: "ZeldaHero", product: "Hyrule Map Pack", amount: 199.99, status: "completed", date: "2026-08-18" },
  { id: "ORD-2346", user: "NESMaster", product: "Retro Console", amount: 499.99, status: "cancelled", date: "2026-08-18" },
  { id: "ORD-2347", user: "GameMaster", product: "Level Editor", amount: 19.99, status: "completed", date: "2026-08-17" },
  { id: "ORD-2348", user: "ArcadeKing", product: "Token Pack x100", amount: 9.99, status: "pending", date: "2026-08-17" },
];

export const statistics = {
  totalUsers: { value: "12,480", change: "+18.4%", trend: "up" },
  revenue: { value: "$84.2K", change: "+12.3%", trend: "up" },
  orders: { value: "3,842", change: "+5.7%", trend: "up" },
  growth: { value: "+18.4%", change: "+2.1%", trend: "up" },
};
