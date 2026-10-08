import './Button.css'

type ButtonProps = {
  children: import('react').ReactNode
  href: string
}

export default function Button({ children, href }: ButtonProps) {
  return (
    <a className="btn" href={href}>
      {children}
    </a>
  )
}
