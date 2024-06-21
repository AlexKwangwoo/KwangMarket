import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";
import Link from "next/link";

// const getCachedProducts = nextCache(getInitialProducts, ["home-products"], {
//   revalidate: 5, //60초가 지나면 이 캐쉬는 오래된것이라 간주되고 다음 콜이 올때는 다시 갱신할것임
// });

const getCachedProducts = nextCache(getInitialProducts, ["home-products"]);

async function getInitialProducts() {
  console.log("hit!!!!");
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    take: 1,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}
//for type, it used the prisma resource that it provides
//-----
export const metadata = {
  title: "Home",
};

// 유저마다 상품 리스트가 다르게 보이지 않기때문에 이페이지는 static이다.. 하지만 static이 되면
// 새로운 상품이 오면 업데이트가 되지 않는다.. revalidate를 하지 않는 이상 그래서
// dynamic 을 사용해 매번 유저가 이 페이지를 요청할때마다 최신html로 만들어 준다
//  export const dynamic = "force-dynamic";

// static으로 돌아갈것임
export const revalidate = 5; // 60초가 지나서 유저가 요청을 한다면.. nextjs가 다시 만들어서 html 파일을 전송해 줄것임..
// 60초안에 요구하면 똑같은 페이지를 줄것임 이동안 suspense를 이용하거나 loading.tsx 페이지를 이용하면된다

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export default async function Products() {
  const initialProducts = await getCachedProducts();
  // const initialProducts = await getInitialProducts();
  const revalidate = async () => {
    "use server";
    revalidatePath("/products");
  };

  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      {/* <form action={revalidate}>
        <button>Revalidate</button>
      </form> */}
      <Link
        href="/products/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
