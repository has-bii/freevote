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
import { Loader, Save, Trash2 } from "lucide-react";
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
import { TChoice } from "@/types/model";
import { removeFile } from "@/utils/remove-file";

type Props = {
  data: TChoice;
  children: React.ReactNode;
};

const FormSchema = z.object({
  name: stringAlphabetNumber,
  description: description,
  link: z.optional(z.string()),
  color: z.string(),
});

export default function EditChoice({ data, children }: Props) {
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = React.useState(false);
  const supabase = useSupabase();
  const query = useQueryClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data.name,
      description: data.description,
      color: data.color,
      link: data.link ?? "",
    },
  });

  async function onSubmit(payload: z.infer<typeof FormSchema>) {
    let image: string | null = data.image;

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

      if (data.image)
        await removeFile({ bucket: "choices", supabase, url: data.image });
    }

    const { error } = await supabase
      .from("choices")
      .update({ image, ...payload })
      .eq("id", data.id);

    if (error) {
      toast.error("Failed to add a choice");
      return;
    }

    query.invalidateQueries({
      queryKey: ["choices", data.voting_id],
    });

    setOpen(false);
    form.reset(payload);
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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Choice</DialogTitle>
          <DialogDescription>
            Modify the details of your choice. Changes will be reflected
            immediately in the voting session.
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
              {!file && !removePhoto ? (
                <Label
                  className={buttonVariants({
                    size: "sm",
                    variant: "secondary",
                  })}
                  role="button"
                >
                  Change photo
                  <Input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={fileOnChange}
                  />
                </Label>
              ) : (
                ""
              )}
              {data.image && file === null ? (
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => setRemovePhoto((prev) => !prev)}
                >
                  {removePhoto ? "Cancel remove" : "Remove photo"}
                </Button>
              ) : (
                ""
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Save />
                )}
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
