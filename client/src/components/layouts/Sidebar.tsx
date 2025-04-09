interface SideBarProps {
  className?: string
}

export default function SideBar({ className = '' }: SideBarProps) {
  return <div className={`${className} `}></div>
}
