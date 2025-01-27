import React from "react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              {children}
              <div className="bg-muted relative hidden md:block">
                {/* Image */}
              </div>
            </CardContent>
          </Card>
          {/* <div className="text-muted-foreground hover:[&_a]:text-primary text-balance text-center text-xs [&_a]:underline [&_a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>
        &nbsp; and <a href="#">Privacy Policy</a>.
      </div> */}
        </div>
      </div>
    </div>
  );
}
