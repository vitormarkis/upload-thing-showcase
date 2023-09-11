import { IconImage } from "@/components/icons/IconImage"
import { UploadButton } from "@/utils/uploadthing"

export type ButtonUploadFileProps = Omit<
  React.ComponentProps<typeof UploadButton>,
  "appearance" | "content"
> & {
  onClick?: () => void
}

export function ButtonUploadFile({ onClick, ...props }: ButtonUploadFileProps) {
  return (
    <div
      className="relative"
      onClick={onClick}
    >
      <UploadButton
        appearance={{
          button:
            "w-14 h-14 relative overflow-hidden rounded-md border cursor-pointer data-[state='uploading']:opacity-95",
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
        {...props}
      />
    </div>
  )
}
