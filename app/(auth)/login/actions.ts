"use server"; // 이렇게 함으로써 patch post 이런걸 따로 만들어서 할필요없다!
import bcrypt from "bcrypt";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";

import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  // if(user){
  //   return true
  // } else {
  //   return false
  // }
  return Boolean(user);
};

export async function handleForm(prevState: any, formData: FormData) {
  // prevState는 사용하는곳의 초기값이 먼저온다!
  console.log("prevState", prevState);
  console.log("formData", formData);

  // console.log(formData.get("email"), formData.get("password"));
  // console.log("i run in the server baby!");
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    errors: ["wrong password", "password too short"],
  };
}

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, "An account with this email does not exist."),
  password: z.string({
    required_error: "Password is required",
  }),
  // .min(PASSWORD_MIN_LENGTH),
  // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export async function logIn(prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = await formSchema.spa(data); //SafeParse = spa
  if (!result.success) {
    console.log(result.error.flatten()); //flatten 에러를 이쁘게 만들어줌
    return result.error.flatten();
  } else {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    const ok = await bcrypt.compare(
      result.data.password,
      user!.password ?? "xxxx" //github 로그인이 가능하기에 pw 가없을수도있다!
    );
    if (ok) {
      const session = await getSession();
      session.id = user!.id;
      await session.save(); //비밀번호와 함친 암호글자로 web 브라우저 cookie에 저장됨!
      redirect("/profile");
    } else {
      return {
        // zod가 애러를 보내는 방식의 오브젝트를 만들어서 리턴.. 마치zod가 한것처럼
        // 그래야 인풋이나 에러낼때 반응이 동일하다!
        fieldErrors: {
          password: ["Wrong password."],
          email: [],
        },
      };
    }
  }
}
