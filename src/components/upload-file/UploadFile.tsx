import Image from "next/image"
import React from "react"
import { FieldPathValue, Noop, RefCallBack } from "react-hook-form"
import "@uploadthing/react/styles.css"
import { cn } from "@/lib/utils"
import { IconTrash } from "@/components/icons/IconTrash"
import { OurFileRouter } from "@/server/uploadthing"
import { UploadDropzone } from "@/utils/uploadthing"

export type UploadFileProps = React.ComponentPropsWithoutRef<"div"> & {
  onChange: (...event: any[]) => void
  onBlur: Noop
  disabled?: boolean
  value: FieldPathValue<any, any>
  name: string
  ref: RefCallBack
} & {
  endpoint: keyof OurFileRouter
}

export const UploadFile = React.forwardRef<React.ElementRef<"div">, UploadFileProps>(
  function UploadFileComponent({ value, name, onChange, endpoint, ...props }, ref) {
    return (
      <div
        {...props}
        data-has-value={!!value}
        className={cn("rounded-lg p-6 data-[has-value='true']:bg-gray-900", props.className)}
        ref={ref}
      >
        {value.length ? (
          <div className="relative w-1/3 aspect-square mx-auto">
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute z-10 right-0 top-0 translate-x-1/2 -translate-y-1/2 grid place-items-center h-7 w-7 rounded-md bg-[#f00]"
            >
              <IconTrash
                size={14}
                className="text-white"
              />
            </button>
            <div className="relative h-full overflow-hidden rounded-lg">
              <Image
                src={value}
                alt="User's profile picture"
                objectFit="cover"
                fill
              />
            </div>
          </div>
        ) : (
          <UploadDropzone
            // className="[&>svg]:max-w-[6rem] p-6"
            endpoint={endpoint}
            onClientUploadComplete={response => {
              const [file] = response ?? []
              onChange(file.url)
            }}
            onUploadError={console.log}
          />
        )}
      </div>
    )
  }
)

UploadFile.displayName = "UploadFile"
