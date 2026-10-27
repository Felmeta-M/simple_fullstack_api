import { getDb } from "@/lib/db";
import { registerForEvent } from "@/lib/events";

export async function POST(request, { params }) {
  const { id } = await params;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be JSON" }, { status: 400 });
  }

  const result = registerForEvent(getDb(), id, body);
  return Response.json(result.body, { status: result.status });
}
