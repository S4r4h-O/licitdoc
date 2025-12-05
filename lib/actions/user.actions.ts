"use server";

import { prisma } from "@/prisma/client";

export async function getUserByClerkId(clerkId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) throw new Error("User not found");

  return user;
}
