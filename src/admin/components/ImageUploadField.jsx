import { useEffect, useState } from 'react';
import { resolveImageUrl, uploadPublicImage, validateImageFile } from '../../lib/images';
import { useAdminLanguage } from '../i18n/AdminLanguageContext';

export default function ImageUploadField({ label, path, folder, disabled, onUploaded }) {
  const { t } = useAdminLanguage();
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
    const validationError = validateImageFile(nextFile);
    const error = validationError === 'Vui lòng chọn một ảnh.' ? t('upload.selectRequired')
      : validationError === 'Chỉ chấp nhận JPG, PNG hoặc WebP.' ? t('upload.invalidType')
        : validationError === 'Ảnh phải nhỏ hơn hoặc bằng 5 MB.' ? t('upload.tooLarge') : validationError;
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
    setStatus({ type: 'info', message: t('upload.uploading') });
    try {
      const uploadedPath = await uploadPublicImage(file, folder);
      await onUploaded(uploadedPath);
      setFile(null);
      setStatus({ type: 'success', message: t('upload.success') });
    } catch (error) {
      const policyHint = /row-level security|policy|permission|unauthorized/i.test(error.message)
        ? t('upload.policyError')
        : '';
      setStatus({ type: 'error', message: `${error.message}${policyHint}` });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-image-field">
      <span className="admin-label">{label || t('common.image')}</span>
      {preview && <img className="admin-image-preview" src={preview} alt={t('upload.previewAlt')} />}
      <div className="admin-inline-actions">
        <label className={`admin-button admin-button--secondary${disabled ? ' is-disabled' : ''}`}>
          {t('upload.choose')}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={selectFile} disabled={disabled || uploading} hidden />
        </label>
        <button className="admin-button" type="button" onClick={upload} disabled={!file || disabled || uploading}>
          {uploading ? t('upload.uploading') : t('upload.upload')}
        </button>
      </div>
      <small>{t('upload.help')}</small>
      {disabled && <small>{t('upload.saveFirst')}</small>}
      {status.message && <span className={`admin-field-message admin-field-message--${status.type}`} role="status">{status.message}</span>}
    </div>
  );
}
