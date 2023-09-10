import React from "react"
import { createIconAttributes } from "@/components/icons/setup/createIconAttributes"
import { IconProps } from "@/components/icons/setup/icon-props"

export const IconImage = React.forwardRef<React.ElementRef<"svg">, IconProps>(
  function IconImageComponent(props, ref) {
    const attributes = createIconAttributes(props)

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        // className="lucide lucide-image"
        {...attributes}
        ref={ref}
      >
        <rect
          width={18}
          height={18}
          x={3}
          y={3}
          rx={2}
          ry={2}
        />
        <circle
          cx={9}
          cy={9}
          r={2}
        />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    )
  }
)
