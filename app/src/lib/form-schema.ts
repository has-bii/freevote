import { z } from "zod";
import { IconNames } from "./lucid-icons";

export const full_name = z
  .string()
  .trim()
  .regex(/^[A-Za-z\s]*$/, "Only alphabets and spaces are allowed")
  .min(6, "Min. 6 characters")
  .max(255, "Max 255 characters");

export const email = z.string().trim().email();

export const password = z.string().trim().min(8, "Min. 8 characters");

export const photo = z
  .any()
  .refine(
    (file: File) => ["image/png", "image/jpeg"].includes(file.type),
    "File format not supported",
  )
  .refine((file: File) => file.size <= 1024 * 1024, "Min. size 1 MB");

export const stringAlphabetNumber = z
  .string()
  .trim()
  .regex(/^[A-Za-z0-9\s]*$/, "Only alphabets, numbers, and spaces are allowed")
  .min(6, "Min. 6 characters")
  .max(255, "Max 255 characters");

export const description = z.string().trim().max(255, "Max 255 characters");

export const voting_type = z.enum(["voting", "nomination"]);

export const icon = z.enum(IconNames);

export const voting_id = z.string().length(6);
