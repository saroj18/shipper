import type { LogLevel } from "./tool-bar";

export type BuildLog = {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  source: string;
};
// Mock data for demonstration
export const mockLogs: BuildLog[] = [
  {
    id: "1",
    timestamp: "2025-05-17T08:30:12.123Z",
    level: "info",
    message: "Build started",
    source: "system",
  },
  {
    id: "1",
    timestamp: "2025-05-17T08:30:12.123Z",
    level: "info",
    message: "Build started",
    source: "system",
  },
  {
    id: "1",
    timestamp: "2025-05-17T08:30:12.123Z",
    level: "info",
    message: "Build started",
    source: "system",
  },
  {
    id: "1",
    timestamp: "2025-05-17T08:30:12.123Z",
    level: "info",
    message: "Build started",
    source: "system",
  },
  {
    id: "1",
    timestamp: "2025-05-17T08:30:12.123Z",
    level: "info",
    message: "Build started",
    source: "system",
  },
  {
    id: "1",
    timestamp: "2025-05-17T08:30:12.123Z",
    level: "info",
    message: "Build started",
    source: "system",
  },
  {
    id: "1",
    timestamp: "2025-05-17T08:30:12.123Z",
    level: "info",
    message: "Build started",
    source: "system",
  },
  {
    id: "1",
    timestamp: "2025-05-17T08:30:12.123Z",
    level: "info",
    message: "Build started",
    source: "system",
  },
  {
    id: "1",
    timestamp: "2025-05-17T08:30:12.123Z",
    level: "info",
    message: "Build started",
    source: "system",
  },
  {
    id: "1",
    timestamp: "2025-05-17T08:30:12.123Z",
    level: "info",
    message: "Build started",
    source: "system",
  },
  {
    id: "1",
    timestamp: "2025-05-17T08:30:12.123Z",
    level: "info",
    message: "Build started",
    source: "system",
  },
  {
    id: "2",
    timestamp: "2025-05-17T08:30:13.456Z",
    level: "info",
    message: "Installing dependencies...",
    source: "npm",
  },
  {
    id: "3",
    timestamp: "2025-05-17T08:30:15.789Z",
    level: "info",
    message: "added 1232 packages, and audited 1233 packages in 3s",
    source: "npm",
  },
  {
    id: "4",
    timestamp: "2025-05-17T08:30:16.123Z",
    level: "info",
    message: "found 0 vulnerabilities",
    source: "npm",
  },
  {
    id: "5",
    timestamp: "2025-05-17T08:30:17.456Z",
    level: "info",
    message: "Creating an optimized production build...",
    source: "next",
  },
  {
    id: "6",
    timestamp: "2025-05-17T08:30:20.789Z",
    level: "warning",
    message:
      "You have enabled experimental feature (appDir) in next.config.js.",
    source: "next",
  },
  {
    id: "6",
    timestamp: "2025-05-17T08:30:20.789Z",
    level: "warning",
    message:
      "You have enabled experimental feature (appDir) in next.config.js.",
    source: "next",
  },
  {
    id: "6",
    timestamp: "2025-05-17T08:30:20.789Z",
    level: "warning",
    message:
      "You have enabled experimental feature (appDir) in next.config.js.",
    source: "next",
  },
  {
    id: "7",
    timestamp: "2025-05-17T08:30:21.123Z",
    level: "info",
    message: "Compiled successfully",
    source: "webpack",
  },
  {
    id: "8",
    timestamp: "2025-05-17T08:30:22.456Z",
    level: "error",
    message: "Failed to load module: Cannot find module './missing-module'",
    source: "webpack",
  },
  {
    id: "9",
    timestamp: "2025-05-17T08:30:23.789Z",
    level: "info",
    message: "Route (app)/(dashboard)/dashboard: building...",
    source: "next",
  },
  {
    id: "10",
    timestamp: "2025-05-17T08:30:24.123Z",
    level: "info",
    message: "Route (app)/(dashboard)/dashboard: built successfully",
    source: "next",
  },
  {
    id: "11",
    timestamp: "2025-05-17T08:30:25.456Z",
    level: "info",
    message: "Route (app)/(auth)/login: building...",
    source: "next",
  },
  {
    id: "12",
    timestamp: "2025-05-17T08:30:26.789Z",
    level: "info",
    message: "Route (app)/(auth)/login: built successfully",
    source: "next",
  },
  {
    id: "13",
    timestamp: "2025-05-17T08:30:27.123Z",
    level: "info",
    message: "Generating static pages (0/12)",
    source: "next",
  },
  {
    id: "14",
    timestamp: "2025-05-17T08:30:28.456Z",
    level: "info",
    message: "Generating static pages (6/12)",
    source: "next",
  },
  {
    id: "15",
    timestamp: "2025-05-17T08:30:29.789Z",
    level: "info",
    message: "Generating static pages (12/12)",
    source: "next",
  },
  {
    id: "16",
    timestamp: "2025-05-17T08:30:30.123Z",
    level: "success",
    message: "✓ Build completed successfully",
    source: "system",
  },
  {
    id: "17",
    timestamp: "2025-05-17T08:30:31.456Z",
    level: "info",
    message: "Deployment started...",
    source: "vercel",
  },
  {
    id: "18",
    timestamp: "2025-05-17T08:30:32.789Z",
    level: "info",
    message: "Uploading build artifacts...",
    source: "vercel",
  },
  {
    id: "19",
    timestamp: "2025-05-17T08:30:33.123Z",
    level: "info",
    message: "Finalizing deployment...",
    source: "vercel",
  },
  {
    id: "20",
    timestamp: "2025-05-17T08:30:34.456Z",
    level: "success",
    message: "✓ Deployment completed successfully",
    source: "vercel",
  },
];
