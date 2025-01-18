/* eslint-disable @next/next/no-img-element */
"use client";

import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Label } from "./ui/label";
import { photo } from "@/lib/form-schema";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  type Crop,
} from "react-image-crop";
import { setCanvasPreview } from "@/utils/set-canvas-preview";
import { useSupabase } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateAuth } from "@/hooks/auth/use-auth";
import { getPublicUrl } from "@/utils/get-public-url";
import { generateRandomName } from "@/utils/generate-random-name";

type Props = {
  user?: User | null;
};

export default function ChangePhotoForm({ user }: Props) {
  const supabase = useSupabase();
  const query = useQueryClient();
  const { mutateAsync } = useUpdateAuth(supabase, query);
  const [fileSrc, setFileSrc] = React.useState<string>();
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [crop, setCrop] = React.useState<Crop>();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFileSrc(undefined);
      return;
    }

    const { data, error } = photo.safeParse(e.target.files[0] as File);

    if (error) toast.error(error.flatten().formErrors.join(", "));

    setFileSrc(URL.createObjectURL(data));
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;

    setCrop(
      centerCrop(
        makeAspectCrop(
          {
            unit: "%",
            width: 90,
          },
          1,
          width,
          height,
        ),
        width,
        height,
      ),
    );
  };

  const onUpdateImage = async () => {
    setCanvasPreview(
      imgRef.current!,
      canvasRef.current!,
      convertToPixelCrop(
        crop!,
        imgRef.current?.width || 0,
        imgRef.current?.height || 0,
      ),
    );

    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL("image/jpeg", 0.5);

      const blob = await fetch(url).then((res) => res.blob());

      const toastId = toast.loading("Uploading...", {
        duration: Infinity,
      });

      const { error, data } = await supabase.storage
        .from("avatars")
        .upload(generateRandomName("jpeg"), blob, {
          upsert: true,
        });

      if (error) {
        toast.dismiss(toastId);
        toast.error(error.message);
        return;
      }

      if (user?.user_metadata.avatar)
        await supabase.storage
          .from("avatars")
          .remove([
            (user.user_metadata.avatar as string).split("avatars/").pop()!,
          ]);

      await mutateAsync({
        avatar: getPublicUrl({ supabase, bucket: "avatars", url: data.path }),
      });

      setFileSrc(undefined);
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="flex w-fit items-end gap-4">
      <Avatar className="h-28 w-28 rounded-lg">
        <AvatarImage src={user?.user_metadata?.avatar} />
        <AvatarFallback className="rounded-lg text-2xl">
          {(user?.user_metadata.full_name as string)
            ?.split(" ")
            .map((c) => c[0].toUpperCase())
            .join("")}
        </AvatarFallback>
      </Avatar>
      <Label className={buttonVariants({ size: "sm" })} role="button">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onChangeFile}
        />
        <Pencil />
        Change
      </Label>
      {fileSrc !== undefined && (
        <Dialog
          open
          onOpenChange={() => {
            setFileSrc(undefined);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crop profile picture</DialogTitle>
              <DialogDescription>
                Crop your profile picture to resize it.
              </DialogDescription>
            </DialogHeader>
            <ReactCrop
              crop={crop}
              onChange={(_, p) => setCrop(p)}
              aspect={1}
              keepSelection
            >
              <img
                ref={imgRef}
                src={fileSrc}
                alt="image"
                onLoad={onImageLoad}
              />
            </ReactCrop>
            <Button onClick={onUpdateImage}>Set new profile picture</Button>
            <canvas ref={canvasRef} className="hidden" />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
