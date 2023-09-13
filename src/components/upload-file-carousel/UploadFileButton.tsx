import Image from "next/image"
import Link from "next/link"
import React, { useContext } from "react"
import { FieldPath, FieldValues } from "react-hook-form"
import { UploadFileResponse } from "uploadthing/client"
import { cn } from "@/lib/utils"
import { IconImage } from "@/components/icons/IconImage"
import { IconTrash } from "@/components/icons/IconTrash"
import {
  ControllerField,
  FormField,
  UploadButtonChooseFile,
} from "@/components/upload-file-carousel/UploadFileButton.types"
import { ButtonUploadFile } from "@/components/upload-file-carousel/button-upload-file/ButtonUploadFile"
import {
  UploadFileContext,
  UploadFileProvider,
} from "@/components/upload-file-carousel/contexts/upload-file-context"

export type UploadFileCarouselProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = ControllerField<UploadFileResponse[]> &
  UploadButtonChooseFile &
  FormField<TFieldValues, TName> & {
    maxUploads?: number
  }

export const UploadFileChooseFile = ButtonUploadFile

export function UploadFileCarousel<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ maxUploads = 5, ...providerProps }: UploadFileCarouselProps<TFieldValues, TName>) {
  return (
    <div
      role="combobox"
      className="flex flex-col text-foreground gap-2"
    >
      <div className="flex gap-2">
        <UploadFileProvider
          maxUploads={maxUploads}
          {...providerProps}
        >
          {Array.from({ length: maxUploads }).map((_, i) =>
            providerProps.value[i] ? (
              <UploadFileImage
                key={providerProps.value[i].url}
                res={providerProps.value[i]}
              />
            ) : (
              <UploadFileChooseFile key={i} />
            )
          )}
        </UploadFileProvider>
      </div>
    </div>
  )
}

UploadFileCarousel.displayName = "UploadFileButton"

export type UploadFileImageProps = React.ComponentPropsWithoutRef<"div"> & {
  res: UploadFileResponse
}

export const UploadFileImage = React.forwardRef<React.ElementRef<"div">, UploadFileImageProps>(
  function UploadFileImageComponent({ res, ...props }, ref) {
    const { handleRemoveFile } = useContext(UploadFileContext)

    return (
      <div
        {...props}
        className={cn(
          "relative transition-[box-shadow,opacity,transform] duration-300 hover:translate-y-[-2px]",
          `
          [&:is(:focus-within,:hover)_[data-type='remove-upload-file']]:translate-y-0
          [&:is(:focus-within,:hover)_[data-type='remove-upload-file']]:opacity-100
          [&:is(:focus-within,:hover)_[data-type='remove-upload-file']]:scale-100
          `
            // [&:has(a:focus)[data-type='image-wrapper']]:ring-[1.5px]
            // [&:has(a:focus)[data-type='image-wrapper']]:ring-[#077c7c]
            // [&:has(a:focus)[data-type='image-wrapper']]:border-[#0ff]
            .replace(/\s+/g, " ")
            .trim(),
          props.className
        )}
        ref={ref}
        tabIndex={-1}
      >
        <UploadFileRemoveFile onClick={() => handleRemoveFile({ fileUrl: res.url })} />
        <Link
          target="_blank"
          href={res.url}
          className={cn(
            "peer block before:transition-[transform,brightness] duration-100 ease-in-out absolute z-10 inset-0",
            "focus-visible:outline-none outline-none"
          )}
        />
        <div
          data-type="image-wrapper"
          className={cn(
            "border w-14 h-14 rounded-md relative overflow-hidden",
            `
          peer-focus:ring-[1.5px]
          peer-focus:ring-[#077c7c]
          peer-focus:border-[#0ff]
        `
          )}
        >
          <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
          <Image
            alt="example image"
            src={res.url}
            className="object-cover focus:outline-none"
            sizes="(max-width: 768px) 10vw, (max-width: 1200px) 50vw"
            quality={5}
            fill
          />
        </div>
      </div>
    )
  }
)

UploadFileImage.displayName = "UploadFileImage"

export type UploadFileImagePlaceholderProps = React.ComponentPropsWithoutRef<"div"> & {
  isUploading: boolean
  isNext: boolean
}

export const UploadFileImagePlaceholder = React.forwardRef<
  React.ElementRef<"div">,
  UploadFileImagePlaceholderProps
>(function UploadFileImagePlaceholderComponent({ isNext, isUploading, ...props }, ref) {
  return (
    <div
      {...props}
      className={cn(
        "w-14 h-14 relative overflow-hidden rounded-md border bg-background",
        "grid place-items-center",
        props.className
      )}
      ref={ref}
    >
      {isNext && isUploading ? null : (
        <IconImage
          size={20}
          strokeWidth={2}
          className="text-border"
        />
      )}
      {isUploading && (
        <div className="border-[4px] h-6 w-6 border-transparent border-b-white bg-transparent rounded-full animate-spin" />
      )}
    </div>
  )
})

UploadFileImagePlaceholder.displayName = "UploadFileImagePlaceholder"

export type UploadFileRemoveFileProps = React.ComponentPropsWithoutRef<"div"> & {}

export const UploadFileRemoveFile = React.forwardRef<
  React.ElementRef<"div">,
  UploadFileRemoveFileProps
>(function UploadFileRemoveFileComponent({ ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        "absolute z-20 right-0 top-0 translate-x-1/2 -translate-y-1/2",
        props.className
      )}
    >
      <button
        data-type="remove-upload-file"
        type="button"
        className={cn(
          "h-4 w-4 rounded-sm bg-red-500 grid place-items-center transition-[box-shadow,opacity,transform] duration-200 border border-red-500",
          "translate-y-1 opacity-0 scale-90",
          `
              focus:outline-none
              focus:ring-1
              focus:ring-white
              focus:border-red-800
          `
        )}
      >
        <IconTrash size={10} />
      </button>
    </div>
  )
})

UploadFileRemoveFile.displayName = "UploadFileRemoveFile"
