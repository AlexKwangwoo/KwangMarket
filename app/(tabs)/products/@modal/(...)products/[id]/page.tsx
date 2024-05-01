"use client";

import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function Modal({ params }: { params: { id: string } }) {
  const router = useRouter();
  const onCloseClick = () => {
    router.back();
  };
  // 지금은 클라이언트 컴포넌트인데.. 서버에서 내용받고 주고 하고싶으면
  // 전체를 서버로 만들고 버튼만 클라이언트 컴포넌트로 따로 빼서 만드는게 효율이 좋음
  return (
    <div className="absolute w-full h-full z-50 flex items-center justify-center bg-black bg-opacity-60 left-0 top-0">
      <button
        onClick={onCloseClick}
        className="absolute right-5 top-5 text-neutral-200"
      >
        <XMarkIcon className="size-10" />
      </button>
      <div className="max-w-screen-sm h-1/2  flex justify-center w-full">
        <div className="aspect-square  bg-neutral-700 text-neutral-200  rounded-md flex justify-center items-center">
          <PhotoIcon className="h-28" />
        </div>
      </div>
    </div>
  );
}
