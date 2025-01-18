import { z } from "zod";

export const full_name = z
  .string()
  .trim()
  .regex(/^[A-Za-z\s]*$/, "Only alphabets and spaces are allowed")
  .min(6)
  .max(255);

export const email = z.string().trim().email();

export const password = z.string().trim().min(8);

export const photo = z
  .any()
  .refine(
    (file: File) => ["image/png", "image/jpeg"].includes(file.type),
    "File format not supported",
  )
  .refine((file: File) => file.size <= 1024 * 1024, "Min. size 1 MB");
