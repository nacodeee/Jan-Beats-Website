import { X } from 'lucide-react';

export function Modal({ children, onClose, label }) {
  return (
    <div
      className="overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className="modalContent" role="dialog" aria-modal="true" aria-label={label}>
        <button className="modalClose" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        {children}
      </section>
    </div>
  );
}
