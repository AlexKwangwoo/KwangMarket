"use server";

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
