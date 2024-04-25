----- install ------
npx create-next-app@latest

---- run -----
yarn run dev
npx prisma migrate dev
npx prisma studio (안될때 sudo넣기)

0. route.ts 파일은 api가 오는 주소라고 생각하면됨
1. const { pending } = useFormStatus(); 는 자식에서만 사용가능!! <form> 에서는 사용 불가능! 자식에서만!
2. input에는 name이 무조건 있어야한다!
3. input에 key값을 잘 사용해야 렌더될때 값이 남고 안남고가 유지된다

----- 데이터베이스 시작 ----------

4. npx prisma init

5. refine 으로 하면.. 다른필드에 오류있어도 검사한다.. 데이터베이스 낭비가될수있다.. 한번오류나면 즉시멈추게 하기위해
   superrefine을 써주면 된다!

------ cookie ------ session 이용!

6. getIronSession 를 이용해서 쿠키를 암호화해서 저장하고 암호화한걸 불러와서 다시 꺼내볼수도 있다!

## ======== server component 만들려면!!!!!!

-- 만드는 이유는 이렇게 하면 post,get 라우터 파일을 따로 안만들어도 된다!

ex) 밑에와 같은 통신이 일어날 필요없다! 바로 클라이언트 컴포넌트에서 처리해줌. 풀스택할때만!!

<!-- import { redirect } from "next/navigation"; -->

<!-- export function GET() {
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
} -->

7. onClick쓰면 항상 클라이언트가되는데 버튼한개만두고 form에 너호 action={함수} 하면 함수안에 "use server"
   쓰고 구축하면 서버 컴포넌트가 될수있다

8. "use server"; 써주면 서버측에서 함수가 실행되게 해준다! 파일맨위에 써도되고(페이지전체가 서버관련) 함수안에써도됨!
9. 미들웨어는 가볍게 움직여야한다.. 빨리빨리 실행되고 메인 response를 전달 해줘야하는데.. 여이에 미들웨어는 nodejs 런타임이 아닌 edge 런타임인데.. 이게뭐냐면 많이 경량화된 nodejs이다.. 그래서 간혹 라이브러리를 미들웨어에서 실행할려하거나 무거운 작업을 할려는경우 에러를 일으킬수있다..

========== github ==========

10. https://github.com/settings/applications/new 로 가서 new Oauth application을 열어줘야함
11. github로그인 버튼을 누르면 /start get api를 부르게 된다.. 거기에 finalUrl을 통해 깃헙 페이지가서
    승인을 눌러주면 깃헙설정에서 해놓은 redirect을 통해 complete 주소로 ?code=xxxxx 와 함께 api를 부르게 되고
    compelete get api 에서 code를 통해 다시한번 깃험주소와함께 code를 넣어 fetch를 통해 access token을 가지게 되며 이 토큰을 다시 깃헙 api에 보내게되면 우리가 월하는 유저 정보를 가져올수있다 그러면 유저존재하거나 없거나에따라 데이터베이스에 저장한후 쿠키 저장후 사용가능! (두번연속하면 Cors 에러 가 나오는듯?)

12. 괄호를 사용한 파일 이름은 URL에 전혀 영향을 주지 않는다 같은 레벨의 URL이라도 다른 레이어 가능! (auth) vs (tabs)

13. loading.tsx 는 nextjs가 페이지 로딩때 부를것임!

14. nextjs 는 이미지 최적하를하기에.. 서버에 과부하나 많은 비용이 들수있다.. 이를 허락하기위해서는 nextConfig에 넣어줘야함

15.
