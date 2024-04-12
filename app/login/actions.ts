"use server";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import { z } from "zod";

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
  email: z.string().email().toLowerCase(),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export async function logIn(prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
