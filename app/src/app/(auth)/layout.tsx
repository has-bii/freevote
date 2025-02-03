import Image from "next/image";
import Link from "next/link";
import logoImg from "@/app/icon_black.png";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/components/theme-toggle";
import ImageCarousel from "@/components/auth/image-carousel";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={buttonVariants({
                variant: "ghost",
              })}
            >
              <Image
                alt="logo"
                src={logoImg}
                className="rounded-lg bg-black p-1 dark:invert"
              />
              <span className="font-semibold">Quick Vote</span>
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
      <ImageCarousel />
    </div>
  );
}
