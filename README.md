----- install ------
npx create-next-app@latest

---- run -----
yarn run dev
npx prisma migrate dev
npx prisma studio (안될때 sudo넣기)

1.  const { pending } = useFormStatus(); 는 자식에서만 사용가능!! <form> 에서는 사용 불가능! 자식에서만!
2.  input에는 name이 무조건 있어야한다!
3.  input에 key값을 잘 사용해야 렌더될때 값이 남고 안남고가 유지된다

----- 데이터베이스 시작 ----------

4. npx prisma init

5. refine 으로 하면.. 다른필드에 오류있어도 검사한다.. 데이터베이스 낭비가될수있다.. 한번오류나면 즉시멈추게 하기위해
   superrefine을 써주면 된다!

------ cookie ------ session 이용!

6. getIronSession 를 이용해서 쿠키를 암호화해서 저장하고 암호화한걸 불러와서 다시 꺼내볼수도 있다!

======== server component 만들려면

7. onClick쓰면 항상 클라이언트가되는데 버튼한개만두고 form에 너호 action={함수} 하면 함수안에 "use server"
   쓰고 구축하면 서버 컴포넌트가 될수있다

8. "use server"; 써주면 서버측에서 함수가 실행되게 해준다! 파일맨위에 써도되고(페이지전체가 서버관련) 함수안에써도됨!
9. 미들웨어는 가볍게 움직여야한다.. 빨리빨리 실행되고 메인 response를 전달 해줘야하는데.. 여이에 미들웨어는 nodejs 런타임이 아닌 edge 런타임인데.. 이게뭐냐면 많이 경량화된 nodejs이다.. 그래서 간혹 라이브러리를 미들웨어에서 실행할려하거나 무거운 작업을 할려는경우 에러를 일으킬수있다..

10.
