import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

//이름이 다르면안된다
export async function middleware(request: NextRequest) {
  const session = await getSession();
  console.log(session);
  // 매순간의 리퀘스트가 있을때마다 여기를 지나가는데.. 그래서 7번이나 console이 찍힌다..
  // 그래서 어느곳에서 반응해주면 좋을지 경로를 정해줘야한다

  if (request.nextUrl.pathname === "/") {
    const response = NextResponse.next();
    response.cookies.set("middleware-cookie", "hello");

    return response;
  }

  if (request.nextUrl.pathname === "/profile") {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

//이름이 다르면안된다, 어디서만 실행될껀지 정해주는곳.. css나 js 부르는데도 쿠키를 저장하고싶지않음
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      // 이거만 있을때 하라!
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      // missing 도 있음.. 이거 없을떄에만 해주세요! 즉 소스안에 내용일때 실행하되 missing이 없어야지만 실행!
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },

    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      has: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },

    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      has: [{ type: "header", key: "x-present" }],
      missing: [{ type: "header", key: "x-missing", value: "prefetch" }],
    },
  ],
};
