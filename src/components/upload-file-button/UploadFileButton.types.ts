import { UploadButton } from "@/utils/uploadthing"
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form"
import { UploadFileResponse } from "uploadthing/client"

export type Field = Omit<ControllerRenderProps<any, any>, "onChange" | "value"> & {
  onChange: (value: UploadFileResponse[]) => void
  value: UploadFileResponse[]
}

export type UploadButtonChooseFile = Pick<React.ComponentProps<typeof UploadButton>, "endpoint">

export interface FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> {
  formField: TName
}
