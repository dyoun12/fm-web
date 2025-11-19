import { memo } from "react"

type SvgProps = React.ComponentPropsWithoutRef<"svg">

export const DotsHorizontalIcon = memo(
  ({ className, ...props }: SvgProps) => {
    return (
      <svg
        width="24"
        height="24"
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <circle cx="6" cy="12" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="18" cy="12" r="1.5" />
      </svg>
    )
  }
)

DotsHorizontalIcon.displayName = "DotsHorizontalIcon"
