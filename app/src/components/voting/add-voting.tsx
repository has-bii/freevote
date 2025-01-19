"use client";

import React, { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import {
  description,
  icon,
  stringAlphabetNumber,
  voting_type,
} from "@/lib/form-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IconNames } from "@/lib/lucid-icons";
import { DynamicIcon } from "lucide-react/dynamic";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader, Plus } from "lucide-react";
import { useSupabase } from "@/utils/supabase/client";

type Props = {
  children: React.ReactNode;
};

const FormSchema = z.object({
  name: stringAlphabetNumber,
  description: description,
  type: voting_type,
  icon: icon,
});

export default function AddVoting({ children }: Props) {
  const [open, setOpen] = React.useState<boolean>(false);
  const query = useQueryClient();
  const supabase = useSupabase();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "voting",
      icon: "target",
    },
  });

  const onSubmit = useCallback(
    async (payload: z.infer<typeof FormSchema>) => {
      try {
        const { error } = await supabase.from("votings").insert(payload);

        if (error) {
          toast.error("Failed to add new voting");
          return;
        }

        query.invalidateQueries({ queryKey: ["votings"] });
        setOpen(false);
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        else toast.error("Unexpected error has occurred!");
      }
    },
    [query, supabase],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Voting</DialogTitle>
          <DialogDescription>
            Provide a name, optional description, and type for your new voting
            session.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The voting name will be displayed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about the voting"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Max is 255 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="voting">Voting</SelectItem>
                      <SelectItem value="nomination">Nomination</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {IconNames.map((i) => (
                        <SelectItem key={i} value={i}>
                          <div className="flex items-center gap-2">
                            <DynamicIcon name={i} size="20" />
                            {i}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Add
                {form.formState.isSubmitting ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Plus />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
