import { cn } from "@/lib/utils"
import { IconOptions, IconProps } from "@/components/icons/setup/icon-props"
import { cssVariables } from "@/utils/cssVariables"

export const createIconAttributes = (
  { className, style, size = 18, ...props }: IconProps,
  options: IconOptions = {}
) => {
  const { omitFill } = options
  const sizeInRem = String(size / 16).slice(0, 5)

  return {
    ...props,
    className: cn(
      "h-[var(--iconSize)] w-[var(--iconSize)] text-symbol",
      !omitFill && "fill-symbol",
      className
    ),
    style: cssVariables(["iconSize", sizeInRem, "rem"], style),
  }
}
