import z from "zod";

export const registerSchema = z.object({
  email: z.string().min(1, "This Field Must be Filled").email("Invalid Email"),
  password: z.string().min(6, "password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().min(1, "This Field Must be Filled").email("Invalid Email"),
  password: z.string().min(1, "Password is Required"),
});
