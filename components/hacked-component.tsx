"use client";

import { fetchFromAPI } from "@/app/extras/hacked/actions";
import { revalidatePath } from "next/cache";
import { useEffect } from "react";

export default async function HackedComponent({ data }: any) {
  // const result = async () => {
  //   await fetchFromAPI();
  // };

  let ha = await fetchFromAPI();

  console.log("ha", ha);

  return <h1>hacked!!!</h1>;
}
