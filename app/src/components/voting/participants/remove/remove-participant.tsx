"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TParticipant } from "@/types/model";
import { Button } from "@/components/ui/button";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { actionRemoveParticipant } from "./action-remove-participant";
import { revalidateVote } from "@/actions/revalidate-vote";

export type TParticipantRemove = TParticipant & {
  profiles: {
    full_name: string;
    avatar: string | null;
  };
};

type Props = {
  data: TParticipantRemove;
  children: React.ReactNode;
};

export default function RemoveParticipant({ data, children }: Props) {
  const [open, setOpen] = React.useState(false);

  const query = useQueryClient();
  const FormSchema = z.object({
    confirm: z.string().refine((v) => data?.profiles.full_name.trim() === v),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      confirm: "",
    },
  });

  const onSubmit = async () => {
    if (!data) return;

    const { message, success } = await actionRemoveParticipant({ id: data.id });

    if (!success) {
      toast.error(message);
      return;
    }

    toast.success(message);
    revalidateVote();
    form.reset();
    query.invalidateQueries({ queryKey: ["participants", data.voting_id] });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Participant from Voting Session</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this participant from the voting
            session? Once removed, they will no longer have access to vote or
            view the session details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-normal text-muted-foreground">
                    Type&nbsp;
                    <span className="font-medium text-foreground">
                      {data?.profiles.full_name}
                    </span>
                    &nbsp;to confirm action
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={data?.profiles.full_name} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }
              >
                {form.formState.isSubmitting ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Trash2 />
                )}
                Remove
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
