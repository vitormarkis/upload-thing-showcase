import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { Noop, RefCallBack, useFormContext } from "react-hook-form"
import { UploadFileResponse } from "uploadthing/client"
import { z } from "zod"
import "@uploadthing/react/styles.css"
import { cn } from "@/lib/utils"
import { IconImage } from "@/components/icons/IconImage"
import { IconTrash } from "@/components/icons/IconTrash"
import { Button } from "@/components/ui/button"
import { formSchema } from "@/pages"
import { OurFileRouter, imageUploader_maxFileSize } from "@/server/uploadthing"
import { UploadDropzone } from "@/utils/uploadthing"
import st from "./UploadFileCustom.module.css"

type UploadThingInteractionInterface = {
  onChange: (newValue: UploadFileResponse[]) => void
  onBlur?: Noop
  disabled?: boolean
  value: UploadFileResponse[]
  name: string
  ref: RefCallBack
}

export type UploadFileCustomProps = React.ComponentPropsWithoutRef<"div"> &
  UploadThingInteractionInterface & {
    maxUploads?: number
    endpoint: keyof OurFileRouter
  }

export const UploadFileCustom = React.forwardRef<React.ElementRef<"div">, UploadFileCustomProps>(
  function UploadFileCustomComponent({ onChange, endpoint, value, maxUploads = 5, ...props }, ref) {
    const form = useFormContext<z.infer<typeof formSchema>>()
    const [isUploading, setIsUploading] = useState(false)
    const hasReachMaxUploads = value.length >= maxUploads
    const uploadSlotPlaceholders = maxUploads - value.length

    const LIMIT_SIZE = imageUploader_maxFileSize

    const handleChooseFile = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      console.log("TRIGGERING THE CHOOSE FILE BUTTON")

      const wrapperElement = e.currentTarget.closest("[role='combobox']")
      const buttonChooseFile = wrapperElement?.querySelector("label[data-state='ready']")
      const inputChooseFile = wrapperElement?.querySelector(
        "label[data-state='ready'] > input[type='file']"
      )
      if (!inputChooseFile || !buttonChooseFile) return
      // inputChooseFile.onchange = () => {
      //   console.log("Change the file!")
      // }
      inputChooseFile.addEventListener("change", e => {
        console.log("Change the file!")
      })
      buttonChooseFile.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
        })
      )
      console.log(buttonChooseFile)
    }

    const handleMakeUpload = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      console.log("TRIGGERING THE UPLOAD BUTTON")
      setIsUploading(true)

      const wrapperElement = e.currentTarget.closest("[role='combobox']")
      const targetElement = wrapperElement?.querySelector("button[data-state='ready']")
      targetElement?.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
        })
      )
    }

    useEffect(() => {
      const inputElement = document.querySelector("label[data-state='ready'] > input[type='file']")
      const labelElement = document.querySelector("label[data-state='ready']")

      console.log("inputElement", inputElement)
      console.log("labelElement", labelElement)

      const handleChangeHandler = (e: Event) => {
        const target = e.target as HTMLInputElement
        console.log({
          files: target.files,
          value: target.value,
        })
      }

      const handleClickHandler = (e: Event) => {
        const target = e.target as HTMLLabelElement
        console.log("opened!")
      }

      if (inputElement && labelElement) {
        const i = inputElement as HTMLInputElement
        const l = labelElement as HTMLLabelElement
        i.style.display = "block"
        setTimeout(() => {
          i.addEventListener("change", handleChangeHandler)
        }, 10)
        l.addEventListener("click", handleClickHandler)
      }

      return () => {
        if (inputElement && labelElement) {
          const i = inputElement as HTMLInputElement
          const l = labelElement as HTMLLabelElement
          i.removeEventListener("change", handleChangeHandler)
          l.removeEventListener("click", handleClickHandler)
        }
      }
    }, [])

    function handleRemoveFile(fileUrl: string) {
      onChange(value.filter(v => v.url !== fileUrl))
    }

    const handleUploadError: React.ComponentProps<
      typeof UploadDropzone
    >["onUploadError"] = error => {
      setTimeout(() => {
        const uploadThingUploadButton = document.querySelector("button[data-state='ready']")
        uploadThingUploadButton?.setAttribute("data-state", "failed")
        console.log(uploadThingUploadButton)
      }, 1)

      // const uploadThingUploadButton = document.querySelector("button[data-state='ready']")
      // console.log(uploadThingUploadButton)

      setIsUploading(false)
      if (error instanceof Error) {
        if (error.code === "TOO_LARGE") {
          form.setError("profile_pic", {
            message: `O arquivo escolhido excede o limite de ${LIMIT_SIZE} permitido para upload de arquivos.`,
          })
        }
      }
    }

    return (
      // prettier-ignore
      <div {...props} role="combobox" className={cn("flex flex-col text-foreground gap-2 ", st.wrapperDiv, props.className)} ref={ref}>
        <div className={cn(
          "absolute left-0 top-0",
          "bg-[#f99]",
          // "hidden",
          )}>
          <UploadDropzone
            onUploadBegin={console.log}
            endpoint={endpoint}
            onClientUploadComplete={justUploadedFiles => {
              setIsUploading(false)
              if (justUploadedFiles) {
                onChange([...value, ...justUploadedFiles])
              }
            }}
            onUploadError={handleUploadError}
          />
        </div>
        {/* prettier-ignore */}
        <Button type="button" id="button-choosefile" className={cn("mb-4", st.buttonChooseFiles)} disabled={hasReachMaxUploads || isUploading} onClick={handleChooseFile}>
          { isUploading ? "Fazendo upload" : "Escolher arquivo"}
        </Button>
        {/* prettier-ignore */}
        <Button type="button" className={cn("mb-4", st.buttonMakeUpload)} disabled={hasReachMaxUploads || isUploading} onClick={handleMakeUpload}>
          Fazer upload
        </Button>
        <div className="flex gap-2">
          {value.map(res => (
            // prettier-ignore
            <UploadFileImage onRemoveClick={handleRemoveFile} res={res} key={res.url}/>
          ))}
          {Array.from({ length: uploadSlotPlaceholders }).map((_, key) => (
            <UploadFileImagePlaceholder isUploading={key === 0 ? isUploading : false} isNext={key === 0} key={key} />
          ))}
        </div>
      </div>
    )
  }
)

UploadFileCustom.displayName = "UploadFileCustom"

export type UploadFileImageProps = React.ComponentPropsWithoutRef<"div"> & {
  onRemoveClick: (fileUrl: string) => void
  res: UploadFileResponse
}

export const UploadFileImage = React.forwardRef<React.ElementRef<"div">, UploadFileImageProps>(
  function UploadFileImageComponent({ onRemoveClick, res, ...props }, ref) {
    return (
      <div
        {...props}
        className={cn("relative group", props.className)}
        ref={ref}
      >
        <div className={cn("absolute z-20 right-0 top-0 translate-x-1/2 -translate-y-1/2", "")}>
          <button
            onClick={() => onRemoveClick(res.url)}
            type="button"
            className={cn(
              "h-5 w-5 rounded-sm bg-red-500 grid place-items-center transition-all duration-200",
              "translate-y-1 opacity-0 scale-90",
              "group-hover:translate-y-0 group-hover:opacity-100 group-hover:scale-100"
            )}
          >
            <IconTrash size={12} />
          </button>
        </div>
        <div className="w-14 h-14 relative overflow-hidden rounded-md border">
          <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
          <Image
            alt="example image"
            src={res.url}
            className="object-cover"
            sizes="(max-width: 768px) 10vw, (max-width: 1200px) 50vw"
            fill
          />
        </div>
        <Link
          target="_blank"
          href={res.url}
          className={cn(
            "transition-all duration-100 ease-in-out absolute z-10 inset-0",
            "backdrop-blur-none brightness-100",
            "hover:backdrop-blur-[1px] hover:brightness-95"
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
