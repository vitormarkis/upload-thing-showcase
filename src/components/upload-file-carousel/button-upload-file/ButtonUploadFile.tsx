import { useContext } from "react"
import { IconImage } from "@/components/icons/IconImage"
import { UploadFileContext } from "@/components/upload-file-carousel/contexts/upload-file-context"
import { UploadButton } from "@/utils/uploadthing"

export type ButtonUploadFileProps = {}

export function ButtonUploadFile({}: ButtonUploadFileProps) {
  const { onOpenChooseFileWindow, ...uploadButtonProps } = useContext(UploadFileContext)

  return (
    <div
      className="relative border rounded-md focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-[#077c7c] focus-visible:border-[#0ff]"
      onClick={onOpenChooseFileWindow}
      onKeyUp={e => {
        if (onOpenChooseFileWindow && (e.key === "Enter" || e.key === " ")) {
          onOpenChooseFileWindow()
          const uploadButton = e.currentTarget.querySelector(".button-upload-file")
          if (!uploadButton) return

          uploadButton.dispatchEvent(
            new MouseEvent("click", {
              bubbles: true,
              cancelable: true,
            })
          )
        }
      }}
      tabIndex={0}
    >
      <UploadButton
        appearance={{
          button:
            "button-upload-file w-14 h-14 relative overflow-hidden cursor-pointer data-[state='uploading']:opacity-95",
          allowedContent: "hidden",
        }}
        content={{
          button: ({ ready, isUploading }) => {
            if (!ready || isUploading)
              return (
                <div className="border-[4px] h-6 w-6 border-transparent border-b-white bg-transparent rounded-full animate-spin" />
              )
            return (
              <IconImage
                size={20}
                strokeWidth={2}
                className="text-border"
              />
            )
          },
          allowedContent: ({ fileTypes }) => fileTypes,
        }}
        {...uploadButtonProps}
      />
    </div>
  )
}
