import z from "zod";

export const noteSchema = z.object({
  title: z.string().min(1, "Title is Required"),
  content: z.string().min(1, "Content is Required"),
});
