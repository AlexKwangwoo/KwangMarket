"use client";
import { InitialProducts } from "@/app/(tabs)/products/page";
import ListProduct from "./list-product";
import { useEffect, useRef, useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/products/actions";
interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    //페이지가 바뀌게되면 버튼이 화면을 넘어서 구석 밑에 갈것이다.. 그래서 옵져버를 키게되는데 버튼이 보이는지 안보이는지를
    //계속 주시한다..
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        //컨솔로그 찍어보면... isintersecting 이 true라고 표시되면 보인다는뜻 false라고 하면 안보인다는뜻
        // 보이고 안보일떄마다 여기가 컨솔로그가 찍힌다!
        //많은것을 관찰할수있기에... [0]안에 내용을 봐야한다..우리는 버튼 하나만 사용하기에
        console.log("observe", entries);
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          //이미 버튼을 보았기에 여기를 실행하는데 그러면서 꺼준다... 밑에서 페이지가 업데이트됨에 따라 어짜피 다시 실행될꺼기에
          //다시실행되면 새로운 위치에 가있는 버튼이 올때까지 isIntersecting는 거짓을 리턴할것이다
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newProducts = await getMoreProducts(page + 1);
          if (newProducts.length !== 0) {
            setProducts((prev) => [...prev, ...newProducts]);
            setPage((prev) => prev + 1);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
        }
      },
      {
        threshold: 1.0, //버튼이 100퍼센트 보일때까지 기다린다는뜻
        // 마진 설정도 가능.. 화면안에서 어디까지 보이길원하는지
      }
    );

    //위에서 아이탬을 먼저가져와서 넣어주고,.. 버튼에 옵져버기능을 삽입한다
    if (trigger.current) {
      observer.observe(trigger.current);
    }

    // 이컴포넌트가 화면에서 사라질때 연결해제를 한다!
    return () => {
      observer.disconnect();
    };
  }, [page]);
  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {!isLastPage ? (
        <span
          ref={trigger} //
          // style={{
          //   marginTop: `${page + 1 * 900}vh`,
          // }}
          className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 
          py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? "로딩 중" : "Load more"}
        </span>
      ) : null}
    </div>
  );
}
