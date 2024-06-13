import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

export default function getSession() {
  // cookies는 서버쪽컴포넌트에서 쿠키를 접근하는 방법이다!
  return getIronSession<SessionContent>(cookies(), {
    cookieName: "delicious-karrot",
    password: process.env.COOKIE_PASSWORD!, //! 는 무조껀 존재한다는 의미!
  });
}
