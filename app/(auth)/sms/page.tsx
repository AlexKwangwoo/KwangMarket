"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { smsLogIn } from "./actions";

const initialState = {
  token: false,
  error: undefined,
};

export default function SMSLogin() {
  const [state, dispatch] = useFormState(smsLogIn, initialState);
  console.log("check state", state); // 처음에는 initialState가 state에 온다..
  //smsLogIn는 한번 폼안에서 클릭이 없는이상 안에 코드가 작동안될것임..
  // 즉 다음 무언가의 버튼이 눌러지면 form안에 있는 내용이 다시 smsLogin의 formData에 가게된다 그러면서 smsLogin
  //안에 있는 prevState가   token: false error: undefined, 이 전달됨!
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Log in</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        {state.token ? (
          <Input
            name="token"
            key="token"
            type="number"
            placeholder="Verification code"
            required
            min={100000}
            max={999999}
          />
        ) : (
          <Input
            name="phone"
            key="phone"
            type="text"
            placeholder="Phone number"
            required
            defaultValue={"01050663049"}
            errors={state.error?.formErrors}
          />
        )}
        <Button text={state.token ? "Verify Token" : "Send Verification SMS"} />
      </form>
    </div>
  );
}
