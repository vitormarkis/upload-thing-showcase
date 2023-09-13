import React, { createContext, useEffect, useRef } from "react"
import { FieldPath, FieldValues, useFormContext } from "react-hook-form"
import { UploadFileCarouselProps } from "@/components/upload-file-carousel/UploadFileButton"
import { UploadButton } from "@/utils/uploadthing"

type HandleRemoveFile = (subject: { fileUrl: string }) => void
type HandleUploadComplete = React.ComponentProps<typeof UploadButton>["onClientUploadComplete"]
type HandleUploadError = React.ComponentProps<typeof UploadButton>["onUploadError"]
type ErrorCode = Parameters<NonNullable<HandleUploadError>>[0]["code"]

export type IUploadFileContext = Omit<
  React.ComponentProps<typeof UploadButton>,
  "appearance" | "content" | "className"
> & {
  onOpenChooseFileWindow?: () => void
  handleRemoveFile: HandleRemoveFile
}

export const UploadFileContext = createContext({} as IUploadFileContext)

type UploadFileProviderProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<UploadFileCarouselProps<TFieldValues, TName>, "maxUploads"> & {
  maxUploads: number
  children: React.ReactNode
}

export function UploadFileProvider<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: UploadFileProviderProps<TFieldValues, TName>) {
  const form = useFormContext<TFieldValues>()
  const { children, endpoint, formField, maxUploads, ...field } = props

  const imagesDisplayedRef = useRef(field.value)

  useEffect(() => {
    imagesDisplayedRef.current = field.value
  }, [field.value])

  const setErrorMessage = (message: string) => {
    form.setError(formField, {
      message,
    })
  }

  const handleRemoveFile: HandleRemoveFile = subject => {
    field.onChange(field.value.filter(v => v.url !== subject.fileUrl))
  }

  const handleUploadComplete: HandleUploadComplete = res => {
    if (!res) return
    const [file] = res
    console.log(file)
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

  const onOpenChooseFileWindow = () => form.clearErrors(formField)

  return (
    <UploadFileContext.Provider
      value={{
        endpoint,
        onClientUploadComplete: handleUploadComplete,
        onUploadError: handleUploadError,
        onOpenChooseFileWindow,
        handleRemoveFile,
      }}
    >
      {children}
    </UploadFileContext.Provider>
  )
}
