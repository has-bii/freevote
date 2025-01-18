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
import { password } from "@/lib/form-schema";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useSupabase } from "@/utils/supabase/client";

const FormSchema = z
  .object({
    new_password: password,
    confirm_password: password,
  })
  .superRefine(({ confirm_password, new_password }, ctx) => {
    if (new_password.length >= 8 && new_password !== confirm_password)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Confirm password is not the same",
        path: ["confirm_password"],
      });
  });

export default function ChangePasswordForm() {
  const supabase = useSupabase();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      confirm_password: "",
      new_password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const { error } = await supabase.auth.updateUser({
      password: data.new_password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password has been changed");
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter confirm password"
                  {...field}
                />
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
