"use server";

import crypto from "crypto";
import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import getSession from "@/lib/session";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone format"
  );

async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });
  return Boolean(exists);
}

// coerce 는 강제로 숫자로 바꾼다
const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(tokenExists, "This token does not exist.");
interface ActionState {
  token: boolean;
}

async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });
  if (exists) {
    return getToken();
  } else {
    return token;
  }
}

export async function smsLogIn(prevState: ActionState, formData: FormData) {
  console.log("come????");
  const phone = formData.get("phone");
  const token = formData.get("token");
  if (!prevState.token) {
    // 처음에 여기로 올것임.. initialState에서 false엿기에..
    // 그럼 처음으로 폰 번호를 받고 검증한뒤
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      // 맞다면 smsToken이 남아있을수도있으니 지우고
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });
      //토큰을 하나 받아서
      const token = await getToken();
      // 디비에 토큰과 유저 및 휴대폰 번호를 연결시켜준다
      // 그런 유저가 없다면 입력한 폰을 가진 유저를 만들어준다!
      await db.sMSToken.create({
        data: {
          token,
          user: {
            //token을 만드는데 유저랑 연결할것임
            connectOrCreate: {
              where: {
                phone: result.data,
              }, // 폰넘버 입력한 유저를 찾거나.. 없다면
              create: {
                // 만들어줄것임 그런 유저를
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });
      // send the token using twilio
      // const client = twilio(
      //   process.env.TWILIO_ACCOUNT_SID,
      //   process.env.TWILIO_AUTH_TOKEN
      // );
      // await client.messages.create({
      //   body: `Your Karrot verification code is: ${token}`,
      //   from: process.env.TWILIO_PHONE_NUMBER!,
      //   to: process.env.MY_PHONE_NUMBER!,
      // });

      // 보내주면 이게 그다음의 SMSLogin에서의 state가 될것임
      return {
        token: true,
      };
    }
  } else {
    const result = await tokenSchema.spa(token); //safeParseAsync spa
    // 현재이것의 문제는 번호를 입력후 토큰생성을 해서 보내줫는데
    // 여기서는 토큰이 db에 존재하는지만 알아보고 유저아이디를 리턴할것임
    // 즉 처음에 입력했던 번호한테서 나온 토큰인지 아직 알아보지 않았음.. 그래서 토큰에도 휴대폰을 저장하여
    // 처음에 유저가 입력한 휴대폰 번호 및 입력한 토큰이
    // 디비에 있는 토큰과 토큰안에 휴대폰번호랑 대조해서 같아야할것임
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      });
      const session = await getSession();
      session.id = token!.userId;
      await session.save();
      await db.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });
      redirect("/profile");
    }
  }
}
