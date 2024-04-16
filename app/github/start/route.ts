import { redirect } from "next/navigation";

export function GET() {
  const baseURL = "https://github.com/login/oauth/authorize";
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: "read:user,user:email", //로그인 유저에게 뭘 원하는지
    allow_signup: "true", // 깃헙 계정이 있는사람만 가입가능
  };
  //?client_id=~~~~&scope=~~~ 하는대신 밑에의 로직으로 구축가능!
  const formattedParams = new URLSearchParams(params).toString();
  const finalUrl = `${baseURL}?${formattedParams}`;
  console.log("finalUrl", finalUrl);
  return redirect(finalUrl);
}
