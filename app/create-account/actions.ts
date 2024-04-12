"use server";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const checkUsername = (username: string) => !username.includes("potato");
const checkPasswords = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });
  // if (user) {
  //   return false;
  // } else {
  //   return true;
  // }
  return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user) === false;
};

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string!",
        required_error: "Where is my username???",
      })
      .min(3, "Way too short!!!")
      .max(10, "That is too looooong!")
      .trim() //앞뒤 스페이스가 잇으면 없애준다
      .toLowerCase()
      // .transform((username) => `🔥 ${username}`)
      .refine(checkUsername, "No potatoes allowed!")
      .refine(checkUniqueUsername, "This username is already taken"),
    email: z
      .string()
      .email()
      .toLowerCase()
      .refine(
        checkUniqueEmail,
        "There is an account already registered with that email."
      ),
    password: z.string().min(PASSWORD_MIN_LENGTH),
    //.regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),

    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .superRefine(({ password, confirm_password }, ctx) => {
    if (password !== confirm_password) {
      ctx.addIssue({
        code: "custom",
        message: "Two passwords should be equal",
        path: ["confirm_password"], //path가 없으면 global에러라고 착각할것임
      });
    }
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };
  const result = await formSchema.safeParseAsync(data); //parse 는 에러 보내고 safeParse는 에러를 안줌 ,safeParseAsync는async를 쓸수있는 safeParse
  if (!result.success) {
    return result.error.flatten(); //flatten 하면 에러를 좀더 이쁘게 오브젝트안에 넣어 꾸며준다
  } else {
    // result.data 만서야함.. senitize 했다고 생각하자!(transform, trim 등등을거쳐)
    console.log(result.data);
    // hash password
    // save the user to db
    // log the user in
    // redirect "/home"

    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    // cookies 쿠키를 전달해주고
    const cookie = await getIronSession(cookies(), {
      cookieName: "delicious-karrot",
      password: process.env.COOKIE_PASSWORD!, //exclamation mark는 타입이이따고 강제로 그냥 말해주는거! + '
      // 쿠키에 그냥 정보를 저장하는게아니라 암호화해서 저장할것임! 일종의 시크릿키 깉은것임!
    });
    //@ts-ignore
    cookie.id = user.id;
    await cookie.save();
    redirect("/profile");
  }
}
