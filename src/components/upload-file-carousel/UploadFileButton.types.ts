import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form"
import { UploadButton } from "@/utils/uploadthing"

export type ControllerField<TValue> = Omit<
  ControllerRenderProps<any, any>,
  "onChange" | "value"
> & {
  onChange: (value: TValue) => void
  value: TValue
}

export type UploadButtonChooseFile = Pick<React.ComponentProps<typeof UploadButton>, "endpoint">

export interface FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  formField: TName
}
