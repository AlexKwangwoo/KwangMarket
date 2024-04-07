"use client";

import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { handleForm } from "./actions";

export default function LogIn() {
  //state 는 handleForm의 결과가 될것임
  //state 는 handleForm의 결과가 될것임
  //  handleForm뒤의 null은 초기값이다!
  const [state, action] = useFormState(handleForm, { potato: 1 } as any);
  console.log("state", state);

  // async function handleForm(formData: FormData) {
  //   "use server";
  //   await new Promise((resolve) => setTimeout(resolve, 2000));
  //   console.log("logged in!");
  //   // console.log(formData.get("email"), formData.get("password"));
  //   // console.log("i run in the server baby!");
  // }

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <FormInput
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={[]}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.errors ?? []}
        />
        <FormButton text="Log in" />{" "}
      </form>
      <SocialLogin />
    </div>
  );
}
