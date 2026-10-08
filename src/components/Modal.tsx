import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import './Modal.css'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const bounds = event.currentTarget.getBoundingClientRect()
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) onClose()
      }}
    >
      <div className="modal-header">
        <h2 id={titleId}>{title}</h2>
        <button className="modal-close" type="button" aria-label="Fechar modal" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="modal-content">{children}</div>
    </dialog>
  )
}
