import { NextResponse } from "next/server";
import { buildCoachReport } from "@/lib/coach";
import { seedRuns } from "@/lib/seed-runs";
import { loadPlan, loadRuns, upsertRuns } from "@/lib/storage";

export async function GET() {
  const plan = await loadPlan();
  let runs = await loadRuns();
  if (runs.length === 0) {
    runs = await upsertRuns(seedRuns);
  }
  const report = buildCoachReport(plan, runs);
  return NextResponse.json({ plan, report, runs });
}
