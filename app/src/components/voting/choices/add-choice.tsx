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
import { Button, buttonVariants } from "@/components/ui/button";
import { Loader, Plus, Sparkle, Trash2 } from "lucide-react";
import { z } from "zod";
import { description, photo, stringAlphabetNumber } from "@/lib/form-schema";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";
import { useSupabase } from "@/utils/supabase/client";
import { generateRandomName } from "@/utils/generate-random-name";
import { getPublicUrl } from "@/utils/get-public-url";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  id: string;
};

const FormSchema = z.object({
  name: stringAlphabetNumber,
  description: description,
  link: z.optional(z.string()),
  color: z.string(),
});

export default function AddChoice({ id }: Props) {
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const supabase = useSupabase();
  const query = useQueryClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#000000",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    let image: string | null = null;

    if (file) {
      const type = file.type.split("/").pop();
      const { error, data: path } = await supabase.storage
        .from("choices")
        .upload(`${generateRandomName(type)}`, file, {
          metadata: {
            name: data.name,
            desc: data.description,
          },
        });

      if (error) {
        toast.error("Failed to upload photo");
        return;
      }

      if (path)
        image = getPublicUrl({ bucket: "choices", supabase, url: path.path });
    }

    const { error } = await supabase
      .from("choices")
      .insert({ voting_id: id, image, ...data });

    if (error) {
      toast.error("Failed to add a choice");
      return;
    }

    query.invalidateQueries({
      queryKey: ["choices", id],
    });

    setOpen(false);
    form.reset();
    setFile(null);
  }

  const fileOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const temp = e.target.files?.item(0);

    if (!temp) {
      setFile(null);
      return;
    }

    const { data, error } = photo.safeParse(temp);

    if (error) {
      toast.error(error.flatten().formErrors.join(", "));
      setFile(null);
      return;
    }

    setFile(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Sparkle />
          Add choice
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Choice</DialogTitle>
          <DialogDescription>
            Add a new choice to this voting session. Choices help participants
            vote for their preferred options.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:text-red-400 after:content-['*']">
                    Choice Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter choice name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:text-red-400 after:content-['*']">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide additional details about this choice"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:text-red-400 after:content-['*']">
                    Color
                  </FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter choice name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-end gap-2">
              {file && (
                <div className="relative h-32 w-32 overflow-hidden rounded-lg">
                  <Image
                    alt="image"
                    src={URL.createObjectURL(file)}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="absolute right-1 top-1 overflow-hidden rounded-lg bg-destructive p-1.5 text-white"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
              {!file && (
                <Label
                  className={buttonVariants({
                    size: "sm",
                    variant: "secondary",
                  })}
                  role="button"
                >
                  Select photo
                  <Input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={fileOnChange}
                  />
                </Label>
              )}
            </div>

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader className="animate-spin" />
              ) : (
                <Plus />
              )}
              Add
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
