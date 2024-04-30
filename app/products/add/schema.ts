import { z } from "zod";

export const productSchema = z.object({
  photo: z.string({
    required_error: "Photo is required",
  }),
  title: z.string({
    required_error: "Title is required!!!!!",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
  price: z.coerce.number({
    required_error: "Price is required",
  }),
});

// 이렇게 하면 타입을 타입스크립트에 바로 쓸수있다!
export type ProductType = z.infer<typeof productSchema>;
