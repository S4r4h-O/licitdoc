import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { prisma } from "@/prisma/client";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`,
    );

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name } = evt.data;
      await prisma.user.upsert({
        where: { clerkId: id },
        update: {},
        create: {
          clerkId: id,
          email: email_addresses[0].email_address,
          name: `${first_name} ${last_name}`,
        },
      });
    }
  } catch (error) {
    console.log("Error verifying webhook:", error);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
