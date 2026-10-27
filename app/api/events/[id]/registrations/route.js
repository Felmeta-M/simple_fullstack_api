import { getDb } from "@/lib/db";
import { listRegistrations } from "@/lib/events";

export async function GET(request, { params }) {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey || request.headers.get("x-admin-key") !== adminKey) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const registrations = listRegistrations(getDb(), id);
  if (!registrations) return Response.json({ error: "Event not found" }, { status: 404 });

  return Response.json(registrations);
}
