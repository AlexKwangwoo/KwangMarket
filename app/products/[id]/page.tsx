import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  unstable_cache as nextCache,
  revalidatePath,
  revalidateTag,
} from "next/cache";

async function getIsOwner(userId: number) {
  // const session = await getSession();
  // if (session.id) {
  //   return session.id === userId;
  // }
  return false;
}

async function getProduct(id: number) {
  console.log("product");
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

// 캐쉬!! fetch를사용해 주소로 데이터를 주고받으면 자동으로 캐쉬가 될것임! 단!
// get이고 cookies나 header를 쓰지않아야함! 인증관련일수도있고
// 많은 기밀상항이 올수있기에 캐쉬안함!
async function getProduct2(id: number) {
  fetch("https://api.com", {
    next: {
      revalidate: 60,
      tags: ["hello"],
    },
  });
}

const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"], //테그는 여러개 가능.. 한개만 속해도 업데이트 될것임!
});

async function getProductTitle(id: number) {
  console.log("title");
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });
  return product;
}

const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
  tags: ["product-title"],
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProductTitle(Number(params.id));
  return {
    title: product?.title,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId); //getIsOwner에서 쿠키쓰면 프리랜더 안됨! 유저가 누군지 나중에 알아야하기에!  그러면 generateStaticParams 못씀
  const revalidate = async () => {
    "use server";
    // revalidateTag("product-title"); //xxxx 하면 둘다 리프뤠시됨
    //revalidatePath("/products") 도 가능함 그럼 여기이페이지에있는 모든것이 리셋될것임
    revalidateTag("xxxx");
  };

  // console.log("product", product);
  return (
    <div>
      <div className="relative aspect-square">
        <Image
          className="object-cover"
          fill
          src={product.photo}
          alt={product.title}
        />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={`${product.user.avatar}`}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}원
        </span>
        {isOwner ? (
          <form action={revalidate}>
            <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
              Revalidate title cache
            </button>
          </form>
        ) : null}
        <Link
          className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
          href={``}
        >
          채팅하기
        </Link>
      </div>
    </div>
  );
}

// 빌드될때 미리 생성된 페이지들만 찾을수있을것임.. 새로 만들면 예를들어 아이디가 10이 추가됬다 쳐도 10으로 이동하면 404뜰것임!
// export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: {
      id: true,
    },
  });
  return products.map((product) => ({ id: product.id + "" }));
}
