"use server";

export async function handleForm(prevState: any, formData: FormData) {
  console.log("prevState", prevState);
  console.log("formData", formData);

  // console.log(formData.get("email"), formData.get("password"));
  // console.log("i run in the server baby!");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    errors: ["wrong password", "password too short"],
  };
}
