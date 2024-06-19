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
8. async를 쓸려면 서버컴포넌트?
   ex) export async function logIn(prevState: any, formData: FormData)

9. "use server"; 써주면 서버측에서 함수가 실행되게 해준다! 파일맨위에 써도되고(페이지전체가 서버관련) 함수안에써도됨!
10. 미들웨어는 가볍게 움직여야한다.. 빨리빨리 실행되고 메인 response를 전달 해줘야하는데.. 여이에 미들웨어는 nodejs 런타임이 아닌 edge 런타임인데.. 이게뭐냐면 많이 경량화된 nodejs이다.. 그래서 간혹 라이브러리를 미들웨어에서 실행할려하거나 무거운 작업을 할려는경우 에러를 일으킬수있다..

========== github ==========

10. https://github.com/settings/applications/new 로 가서 new Oauth application을 열어줘야함
11. github로그인 버튼을 누르면 /start get api를 부르게 된다.. 거기에 finalUrl을 통해 깃헙 페이지가서
    승인을 눌러주면 깃헙설정에서 해놓은 redirect을 통해 complete 주소로 ?code=xxxxx 와 함께 api를 부르게 되고
    compelete get api 에서 code를 통해 다시한번 깃험주소와함께 code를 넣어 fetch를 통해 access token을 가지게 되며 이 토큰을 다시 깃헙 api에 보내게되면 우리가 월하는 유저 정보를 가져올수있다 그러면 유저존재하거나 없거나에따라 데이터베이스에 저장한후 쿠키 저장후 사용가능! (두번연속하면 Cors 에러 가 나오는듯?)

12. 괄호를 사용한 파일 이름은 URL에 전혀 영향을 주지 않는다 같은 레벨의 URL이라도 다른 레이어 가능! (auth) vs (tabs)

13. loading.tsx 는 nextjs가 페이지 로딩때 부를것임!

14. nextjs 는 이미지 최적하를하기에.. 서버에 과부하나 많은 비용이 들수있다.. 이를 허락하기위해서는 nextConfig에 넣어줘야함

======== infinity scroll =========

15. 로드모어에 ref를 넣고 버튼이 보이면 말해줄것임!

<!--  -->
<!--  -->
<!--  -->

!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
---------- tab 안에 product와 루트안의 product를 나눈이유는 ----------
tab안에 layout이 공유된다.. 밑에 홈 동네생활 체팅 쇼핑 나의당근.. 탭바가...
근데 tab을 나와 루트안에 다시 적어주면 layout이 공유되지 않는다
그럼 tab 안에 products 와 tab바깥에 products 폴더가 있는데 여기서 뭐가 보일지는
그 products 폴더안에 page가 있어야 랜더링 된다 즉 tab안에 있는 products 폴더안에 page가 있어서
그게 렌더될것임 /products 주소로 갔을때!

---------- Form action ----------

15. SMSLogin() page.tsx 살펴볼것!!

//////// 모르면 12.6 recap을 보셈! 정리잘해줌
------ route intercepting --------

16. (..)proudcts/[id] 는 지금 있는 곳 부모의 레벨로 이동해서 그와 똑같은 products 라우터가 있으면 그걸 대신한다!
    단 부모의 라우터에서 (..)product/[id] 로 이동했을때만 가능하다.. 예를들어 /home/(..)product/[id] 이면 home에서 링크를 눌러 product/[id]로 이동하면 인터셉트후 보여줄것이다.. 즉 월래보여줘야하는 /product/[id]는 안보여준다.. 하지만 새로고침을 하면(확실함 ) 월래 product/[id]가 나올것이다!

17. (.)는 본인 위치의 같은 라우터를 인터셉터함 (..) 부모위치에 있는 같은 라우터를 인터셉트함

18. (.)같은레벨 (..)한단계 부모레벨 (..)(..)두단계 부모레벨 참고로 (tabs) / (auth)이건 그룹이지 다음레벨이 아님!

- Parallel Routes

19. 이걸 통해서 한페이지 한에 월래 나와야하는건 흐리게 뒤에 보이고, intercept 한 페이지가 위에 보일것이다
20. 하지만 404가 뜬다.. 루트가 어떻게 되는지 중요
    같은레벨에 @props명 다음안에 페이지가 있어야한다
    즉 내가 /products 주소로 갔을떄 parallel Routes를 보고싶다면
    파일 명도 ex) /@potato/products/parallelPage.tsx 이렇게 폴더를 만들면(최상단 layout에서 props로 potato를 가져올수있다) /products주소갔을때 두개가 겹쳐보일것임
    하지만 많은 url에 저렇게 해줄수없으므로 매치가되는게 없을떄 default.tsx(파일명 동일해야함)을 @potato안에 만들어주면
    매치가 안될때 default.tsx파일을 보여줄것임! 즉 이걸 해주면 404가 없어지고 null만 보여줄것임!
    ex) @potato 안에 page.tsx만들면 즉 /(루트) 에서만 페이지 파일이 보일것임
    ex) app/page.js === app/@children/page.js

    - home에 있는 layout에서 props 를 받는거임.. 그 부모안에있는 layout!
      레이아웃에
      {children}
      {potato} ->props로...
      가 있다치면... @potato 파일로 가서 home 폴더와 page.tsx 를 찾을것임!... 근데 업잖아! 그래서 404내기에 default를 설정해서 null로 보여주고
      대신 /home/product/1 이오면 @potato/products/[id] 가 보여질수있는거임.. (이건 파일안에 있기에)
      설명이 좀 힘듬.. recap 보면 나아질거임 시간걸려도!

21. 즉!! @potato가 계속 trigger되다..default.tsx가 봔환되다 맞는 url이 와서 {potato를 보여주면} 그떄야
    (..)product 페이지가 intercept를 해서 가로체서 나올것임.. home/page 위에!

22. 캐쉬!! fetch를사용해 주소로 데이터를 주고받으면 자동으로 캐쉬가 될것임! 단! get이고 cookies나 header를 쓰지않으면

23. 보는 사람마다 달라지면 다이나믹 / 안달라지면 스테틱.. 그럼 상품 리스트 페이지는.. 보는사람이 달라도 같은 페이지를 리턴해야 하기에 nextjs는 처음에 스테틱이라 생각하고 행동할것임

<!-- https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate -->

24. 'auto' (default): The default option to cache as much as possible without preventing any components from opting into dynamic behavior. 가능한 많이 캐쉬

'force-dynamic': Force dynamic rendering, which will result in routes being rendered for each user at request time. This option is equivalent to getServerSideProps() in the pages directory. 유저가 방문할떄마다 html 페이지를 만들것임!

'error': Force static rendering and cache the data of a layout or page by causing an error if any components use dynamic functions or uncached data. This option is equivalent to:

25. 캐쉬 조합해서 해보자.. export const dynamic = "force-dynamic"; 사용 + nextCache 사용!
    즉 getCachedProducts 를 사용하면 force-dynamic 서도 캐쉬가있으니 캐쉬를 활용한다!

<!-- important!! -->

26. 쿠키세션(서버)쪽에서 사용하면 미리 프리랜더가 안된다!! + nextCache(getProduct, ["product-detail"], {
    tags: ["product-detail-tag"], //테그는 여러개 가능.. 한개만 속해도 업데이트 될것임!
    }); 에서 product-detail은 데이터가 캐쉬되는 key 이름이고 product-detail-tag는 revalidateTag로 저키에 캐쉬 업데이트 가능! 또는 revalidate : 60 이렇게 가능! 또는 revalidatePath로 그안에있는 모든 key 업데이트 가능!(사용하고있다면)

27. composit id 를 이용해서 userid + postid 를 이용해 좋아요 id를 만들것임.. 이렇게하면 한사람당 한포스트에 한개만 가질수있음!

28. 서버렌더링에서 유저랑 소통하고싶으면 form의 action을 사용! 클라이언트렌더링은 onClick그냥 사용하면됨! like dislike 참고!
