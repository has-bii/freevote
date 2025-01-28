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
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
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
import { CirclePlus, Clipboard, Loader } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { joinSession } from "@/actions/join-session";

const FormSchema = z.object({
  id: z.string().uuid(),
});

export default function JoinVoting() {
  const [open, setOpen] = React.useState(false);
  const query = useQueryClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: "",
    },
  });

  const onSubmit = async (payload: z.infer<typeof FormSchema>) => {
    const formData = new FormData();
    formData.set("id", payload.id);

    const { error, message } = await joinSession(formData);

    if (error) {
      toast.error(error);
      form.reset();
      return;
    }

    toast.success(message);
    query.invalidateQueries({ queryKey: ["all votes"] });
    router.push(`/votings/${payload.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          Join
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join a Voting Session</DialogTitle>
          <DialogDescription>
            Enter the Voting ID to join an active voting session. Ensure you
            have the correct ID provided by the organizer.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voting ID</FormLabel>
                  <FormControl>
                    <div className="inline-flex w-full items-center gap-2">
                      <Input placeholder="Enter Voting ID" {...field} />
                      <Button
                        type="button"
                        onClick={async () => {
                          form.setValue(
                            "id",
                            await navigator.clipboard.readText(),
                          );
                        }}
                      >
                        <Clipboard />
                        Paste
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader className="animate-spin" />
              ) : (
                <CirclePlus />
              )}
              Join
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
