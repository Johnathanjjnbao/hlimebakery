import { useEffect, useState } from 'react';
import { resolveImageUrl, uploadPublicImage, validateImageFile } from '../../lib/images';

export default function ImageUploadField({ label = 'Ảnh', path, folder, disabled, onUploaded }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(resolveImageUrl(path));
  const [status, setStatus] = useState({ type: '', message: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPreview(resolveImageUrl(path));
  }, [path]);

  useEffect(() => () => {
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
  }, [preview]);

  const selectFile = (event) => {
    const nextFile = event.target.files?.[0] || null;
    const error = validateImageFile(nextFile);
    if (error) {
      setFile(null);
      setStatus({ type: 'error', message: error });
      return;
    }
    setFile(nextFile);
    setPreview(URL.createObjectURL(nextFile));
    setStatus({ type: '', message: '' });
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setStatus({ type: 'info', message: 'Đang upload…' });
    try {
      const uploadedPath = await uploadPublicImage(file, folder);
      await onUploaded(uploadedPath);
      setFile(null);
      setStatus({ type: 'success', message: 'Upload thành công và đã cập nhật đường dẫn mới.' });
    } catch (error) {
      const policyHint = /row-level security|policy|permission|unauthorized/i.test(error.message)
        ? ' Storage write đang bị chặn bởi policy; không mở quyền anonymous trong bước Admin.'
        : '';
      setStatus({ type: 'error', message: `${error.message}${policyHint}` });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-image-field">
      <span className="admin-label">{label}</span>
      {preview && <img className="admin-image-preview" src={preview} alt="Xem trước ảnh đã chọn" />}
      <div className="admin-inline-actions">
        <label className={`admin-button admin-button--secondary${disabled ? ' is-disabled' : ''}`}>
          Chọn ảnh
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={selectFile} disabled={disabled || uploading} hidden />
        </label>
        <button className="admin-button" type="button" onClick={upload} disabled={!file || disabled || uploading}>
          {uploading ? 'Đang upload…' : 'Upload ảnh'}
        </button>
      </div>
      <small>JPG, PNG hoặc WebP · tối đa 5 MB · mỗi upload dùng URL unique.</small>
      {disabled && <small>Hãy lưu record trước để có đúng thư mục theo ID.</small>}
      {status.message && <span className={`admin-field-message admin-field-message--${status.type}`} role="status">{status.message}</span>}
    </div>
  );
}
