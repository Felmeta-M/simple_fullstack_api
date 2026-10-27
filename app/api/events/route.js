import { getDb } from "@/lib/db";
import { listEvents } from "@/lib/events";

export async function GET() {
  return Response.json(listEvents(getDb()));
}
