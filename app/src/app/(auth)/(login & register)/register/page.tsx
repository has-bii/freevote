import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import filterSearchParams from "@/utils/filter-search-params";
import { signup } from "./actions";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  const params = await searchParams;

  const nameError = filterSearchParams<string | undefined>(
    params.full_name,
    "string",
  );
  const emailError = filterSearchParams<string | undefined>(
    params.email,
    "string",
  );
  const passwordError = filterSearchParams<string | undefined>(
    params.password,
    "string",
  );
  const error = filterSearchParams<string | undefined>(params.error, "string");

  return (
    <form className="p-6 md:p-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Get started</h1>
          <p className="text-muted-foreground text-balance">
            Create your account now
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Hasbiy Robbiy"
            required
          />
          <span
            className={cn(
              "text-destructive text-sm",
              typeof nameError === "undefined" ? "hidden" : "",
            )}
          >
            {nameError}
          </span>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
          <span
            className={cn(
              "text-destructive text-sm",
              typeof emailError === "undefined" ? "hidden" : "",
            )}
          >
            {emailError}
          </span>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
          <span
            className={cn(
              "text-destructive text-sm",
              typeof passwordError === "undefined" ? "hidden" : "",
            )}
          >
            {passwordError}
          </span>
          <span
            className={cn(
              "text-destructive text-sm",
              typeof error === "undefined" ? "hidden" : "",
            )}
          >
            {error}
          </span>
        </div>
        <Button type="submit" formAction={signup} className="w-full">
          Register
        </Button>
        <div className="text-center text-sm">
          Already have an account?&nbsp;
          <Link href="/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </div>
    </form>
  );
}
