import HackedComponent from "@/components/hacked-component";
import { revalidatePath } from "next/cache";
import {
  experimental_taintObjectReference,
  experimental_taintUniqueValue,
} from "react";

async function getData() {
  const keys = {
    apiKey: "11191119",
    secret: "10101001",
  };
  //오브젝트 방지
  // experimental_taintObjectReference("API Keys were leaked!!!", keys);
  // 이렇게하면 api를 통해 클라이언트 쪽으로 안넘어간다!! (값 방지)
  // experimental_taintUniqueValue("Secret key was exposed", keys, keys.secret);
  return keys;
}

export default async function Extras() {
  const data = await getData();

  const action = async () => {
    "use server";
    revalidatePath("/extras/hacked");
  };

  return (
    <div className="flex flex-col gap-3 py-10">
      <h1 className="text-6xl">Extras! hacked</h1>
      <h2 className="font-roboto">So much more to learn!</h2>
      <HackedComponent data={data} />
      <form action={action}>
        <button>revalidate</button>
      </form>
    </div>
  );
}
