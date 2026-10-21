import { UploadCloud } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';

export function FileDropzone({ onFile, accept, label, hint, preview }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  }, [onFile]);

  const handleChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  }, [onFile]);

  return (
    <div
      className={`fileDropzone ${dragging ? 'dragging' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      {preview ? (
        <img src={preview} alt="Preview" className="dropzonePreview" />
      ) : (
        <>
          <UploadCloud size={28} />
          <span>{label}</span>
          {hint && <small>{hint}</small>}
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
