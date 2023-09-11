import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useRef } from "react"
import { FieldPath, FieldValues, useFormContext } from "react-hook-form"
import { UploadFileResponse } from "uploadthing/client"
import { cn } from "@/lib/utils"
import { IconImage } from "@/components/icons/IconImage"
import { IconTrash } from "@/components/icons/IconTrash"
import {
  Field,
  FormField,
  UploadButtonChooseFile,
} from "@/components/upload-file-button/UploadFileButton.types"
import { ButtonUploadFile } from "@/components/upload-file-button/button-upload-file/ButtonUploadFile"
import { UploadButton } from "@/utils/uploadthing"

export const UploadFileChooseFile = ButtonUploadFile

export type UploadFileButtonProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Field &
  UploadButtonChooseFile &
  FormField<TFieldValues, TName> & {
    maxUploads?: number
  }

export function UploadFileButton<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ formField, endpoint, maxUploads = 5, ...field }: UploadFileButtonProps<TFieldValues, TName>) {
  const form = useFormContext<TFieldValues>()

  const setErrorMessage = (message: string) =>
    form.setError(formField, {
      message,
    })

  const imagesDisplayedRef = useRef(field.value)
  useEffect(() => {
    imagesDisplayedRef.current = field.value
  }, [field.value])

  type HandleRemoveFile = UploadFileImageProps["onRemoveClick"]
  type HandleUploadComplete = React.ComponentProps<typeof UploadButton>["onClientUploadComplete"]
  type HandleUploadError = React.ComponentProps<typeof UploadButton>["onUploadError"]
  type ErrorCode = Parameters<NonNullable<HandleUploadError>>[0]["code"]

  const handleRemoveFile: HandleRemoveFile = fileUrl => {
    field.onChange(field.value.filter(v => v.url !== fileUrl))
  }

  const handleUploadComplete: HandleUploadComplete = res => {
    if (!res) return
    const [file] = res
    field.onChange([...imagesDisplayedRef.current, file])
  }

  const handleUploadError: HandleUploadError = error => {
    if (error instanceof Error) {
      const messages: Partial<Record<ErrorCode, string>> = {
        TOO_LARGE: "Tamanho de imagem excedido, o limite são 4MB.",
        BAD_REQUEST: "Erro ao fazer upload. Tente novamente.",
        FILE_LIMIT_EXCEEDED: "Limite the uploads excedido.",
        TOO_SMALL: "Imagem muito pequena.",
        UPLOAD_FAILED: "O upload falhou, tente novamente.",
        TOO_MANY_FILES: "Limite the arquivos excedido.",
      }

      const message = messages[error.code]
      setErrorMessage(message ?? messages.BAD_REQUEST!)
    }
  }

  return (
    <div
      role="combobox"
      className="flex flex-col text-foreground gap-2 "
    >
      <div className="flex gap-2">
        {Array.from({ length: maxUploads }).map((_, i) =>
          field.value[i] ? (
            <UploadFileImage
              key={field.value[i].url}
              onRemoveClick={handleRemoveFile}
              res={field.value[i]}
            />
          ) : (
            <UploadFileChooseFile
              key={i}
              onClick={() => form.clearErrors(formField)}
              endpoint={endpoint}
              onClientUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
            />
          )
        )}
      </div>
    </div>
  )
}

UploadFileButton.displayName = "UploadFileButton"

export type UploadFileImageProps = React.ComponentPropsWithoutRef<"div"> & {
  onRemoveClick: (fileUrl: string) => void
  res: UploadFileResponse
}

export const UploadFileImage = React.forwardRef<React.ElementRef<"div">, UploadFileImageProps>(
  function UploadFileImageComponent({ onRemoveClick, res, ...props }, ref) {
    return (
      <div
        {...props}
        className={cn(
          "relative group transition-all duration-300 hover:translate-y-[-2px]",
          props.className
        )}
        ref={ref}
      >
        <div className={cn("absolute z-20 right-0 top-0 translate-x-1/2 -translate-y-1/2", "")}>
          <button
            onClick={() => onRemoveClick(res.url)}
            type="button"
            className={cn(
              "h-4 w-4 rounded-sm bg-red-500 grid place-items-center transition-all duration-200",
              "translate-y-1 opacity-0 scale-90",
              "group-hover:translate-y-0 group-hover:opacity-100 group-hover:scale-100"
            )}
          >
            <IconTrash size={10} />
          </button>
        </div>
        <div className="w-14 h-14 relative overflow-hidden rounded-md border">
          <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
          <Image
            alt="example image"
            src={res.url}
            className="object-cover"
            sizes="(max-width: 768px) 10vw, (max-width: 1200px) 50vw"
            quality={5}
            fill
          />
        </div>
        <Link
          target="_blank"
          href={res.url}
          className={cn(
            "transition-all duration-100 ease-in-out absolute z-10 inset-0",
            "brightness-100",
            "hover:bg-black/30 hover:brightness-95"
          )}
        />
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