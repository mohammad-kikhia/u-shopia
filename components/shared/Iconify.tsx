import { forwardRef } from 'react'
import { Icon, IconifyIcon, type IconProps } from '@iconify/react'

export type IconifyProps = IconifyIcon | string

type IconifyBaseProps = {
  icon: IconifyProps
  width?: number | string
  height?: number | string
  className?: string
  style?: React.CSSProperties
}

type Props = IconifyBaseProps &
  Omit<IconProps, keyof IconifyBaseProps | 'icon' | 'width' | 'height' | 'style'>

const Iconify = forwardRef<SVGSVGElement, Props>(
  ({ icon, width = 20, height, className, style, ...other }, ref) => (
    <Icon
      ref={ref}
      icon={icon}
      className={className}
      style={{
        width,
        height: height ?? width,
        // display: 'inline-block',
        ...style,
      }}
      {...other}
    />
  )
)

Iconify.displayName = 'Iconify'

export default Iconify
