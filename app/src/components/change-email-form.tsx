"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { email } from "@/lib/form-schema";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useSupabase } from "@/utils/supabase/client";
import { useGetAuth, useUpdateAuth } from "@/hooks/auth/use-auth";
import { useQueryClient } from "@tanstack/react-query";

const FormSchema = z.object({
  email: email,
});

export default function ChangeEmailForm() {
  const supabase = useSupabase();
  const query = useQueryClient();
  const { data: user } = useGetAuth(supabase);
  const { mutateAsync } = useUpdateAuth(supabase, query);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: {
      email: user?.email ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    await mutateAsync(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter new email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
        >
          Change
          {form.formState.isSubmitting && <Loader className="animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
