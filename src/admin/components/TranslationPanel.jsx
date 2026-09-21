import { useState } from 'react';
import { translationStatusLabel } from '../../lib/translation';

export default function TranslationPanel({ status = 'missing', children }) {
  const [message, setMessage] = useState('');
  const isStale = status === 'stale';

  return (
    <section className="admin-translation">
      <div className="admin-translation__header">
        <div>
          <strong>Bản dịch tiếng Hàn (KO)</strong>
          <span className={`admin-status admin-status--${status}`}>{translationStatusLabel(status)}</span>
        </div>
        <button
          className="admin-button admin-button--secondary"
          type="button"
          onClick={() => setMessage('Translation service chưa được cấu hình. Nội dung KO hiện tại không bị thay đổi.')}
        >
          Tự dịch VI → KO
        </button>
      </div>
      {isStale && <p className="admin-warning">Nội dung VI đã thay đổi. Bản KO có thể đã cũ và cần được review; nội dung sửa tay vẫn được giữ nguyên.</p>}
      {message && <p className="admin-warning" role="status">{message}</p>}
      {children}
    </section>
  );
}
