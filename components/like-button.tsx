"use client";

import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { useOptimistic } from "react";
import { dislikePost, likePost } from "@/app/posts/[id]/actions";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  postId,
}: LikeButtonProps) {
  //  useState 차이점은 setState를 사용할 때 서버가 다른 것을 반환할 경우 다른 데이터 또는 오류가 발생하여 상태를
  //  사용 중이기 때문에 사용자가 이를 볼 수 없다는 것입니다.
  // Optimistic을 사용하면 사용자는 결국 서버가 반환하는 실제 데이터를 볼 수 있습니다.
  // Optimistic을 사용하면 서버 작업이 실행되는 동안에만 Optimistic
  // 데이터가 표시되고 실제 데이터가 표시됩니다.
  // useState는 낙관적이지 않고 useState는 낙관적이지 않으며,
  // useState는 데이터를 일시적으로 보여준 다음 실제 데이터를 보여주는 것입니다. useState는 항상 상태를 표시한다는 것을 의미합니다.
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount }, // 유저한테 보여주고싶은 처음데이터!! -> 즉 state 이다! 수정되고도 여기로온다!
    (previousState, payload) => ({
      isLiked: !previousState.isLiked,
      likeCount: previousState.isLiked
        ? previousState.likeCount - 1
        : previousState.likeCount + 1,
    }) //->isLiked, likeCount 이렇게 수정하는게 reducerFn으로 보내진다! [a, setA]=useState(null) 에서 setA부분임!
  ); // 쉽게생각하면 useState랑 비슷..

  const onClick = async () => {
    //undefined 10000을 입력하면 좋아요가 10000개로 보인다.. 이게 payload에 들어갈것임!! 처음인자인 previousState는
    //무시되는듯..
    reducerFn(undefined); // useOptimistic 을 불러 좋아요를 false <-> true 하고 갯수를 미리 변경해버린다!
    if (isLiked) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
    }
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2  transition-colors ${
        state.isLiked
          ? "bg-orange-500 text-white border-orange-500"
          : "hover:bg-neutral-800"
      }`}
    >
      {state.isLiked ? (
        <HandThumbUpIcon className="size-5" />
      ) : (
        <OutlineHandThumbUpIcon className="size-5" />
      )}
      {state.isLiked ? (
        <span> {state.likeCount}</span>
      ) : (
        <span>공감하기 ({state.likeCount})</span>
      )}
    </button>
  );
}
