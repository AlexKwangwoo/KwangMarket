"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";

export async function saveMessage(payload: string, chatRoomId: string) {
  const session = await getSession();
  await db.message.create({
    data: {
      payload,
      chatRoomId,
      userId: session.id!,
    },
    select: { id: true }, //select: { id: true }, 리턴할때 id만 리턴한다는 뜻임!
  });
}
