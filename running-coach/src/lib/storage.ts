import { promises as fs } from "fs";
import path from "path";
import type { RunActivity, TrainingPlan } from "./types";

const dataDir = path.join(process.cwd(), "data");

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

export async function loadPlan(): Promise<TrainingPlan> {
  const raw = await fs.readFile(path.join(dataDir, "plan.json"), "utf8");
  return JSON.parse(raw) as TrainingPlan;
}

export async function loadRuns(): Promise<RunActivity[]> {
  try {
    const raw = await fs.readFile(path.join(dataDir, "runs.json"), "utf8");
    return JSON.parse(raw) as RunActivity[];
  } catch {
    return [];
  }
}

export async function saveRuns(runs: RunActivity[]): Promise<void> {
  await ensureDataDir();
  const sorted = [...runs].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );
  await fs.writeFile(path.join(dataDir, "runs.json"), JSON.stringify(sorted, null, 2));
}

export async function upsertRuns(incoming: RunActivity[]): Promise<RunActivity[]> {
  const existing = await loadRuns();
  const byKey = new Map<string, RunActivity>();
  for (const run of existing) {
    const key = run.stravaId ? `strava:${run.stravaId}` : run.id;
    byKey.set(key, run);
  }
  for (const run of incoming) {
    const key = run.stravaId ? `strava:${run.stravaId}` : run.id;
    byKey.set(key, run);
  }
  const merged = Array.from(byKey.values());
  await saveRuns(merged);
  return merged;
}

export interface StravaTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete?: { id: number; firstname?: string; lastname?: string };
}

export async function loadTokens(): Promise<StravaTokens | null> {
  try {
    const raw = await fs.readFile(path.join(dataDir, "strava-tokens.json"), "utf8");
    return JSON.parse(raw) as StravaTokens;
  } catch {
    return null;
  }
}

export async function saveTokens(tokens: StravaTokens): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(
    path.join(dataDir, "strava-tokens.json"),
    JSON.stringify(tokens, null, 2),
  );
}
