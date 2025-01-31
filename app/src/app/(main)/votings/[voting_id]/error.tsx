"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    const { message, digest } = error;
    console.error({ message, digest });
  }, [error]);

  return (
    <div className="flex flex-1 gap-4 p-4 pt-0">
      <div className="flex flex-1 flex-col md:min-h-min lg:flex-row">
        <div className="m-auto text-center">
          <h2 className="text-[12rem] font-bold leading-none">404</h2>
          <p className="text-xl font-medium">Something went wrong</p>
          <Button
            variant="ghost"
            className="mt-2"
            onClick={() => router.back()}
          >
            <ArrowLeft />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
