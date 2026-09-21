export function AdminLoading({ label = 'Đang tải dữ liệu…' }) {
  return <div className="admin-state" role="status"><span className="admin-spinner" aria-hidden="true" />{label}</div>;
}

export function AdminError({ error, retry }) {
  return (
    <div className="admin-state admin-state--error" role="alert">
      <strong>Không thể hoàn tất yêu cầu</strong>
      <span>{typeof error === 'string' ? error : error?.message || 'Đã xảy ra lỗi.'}</span>
      {retry && <button className="admin-button admin-button--secondary" type="button" onClick={retry}>Thử lại</button>}
    </div>
  );
}

export function AdminEmpty({ title, text, action }) {
  return <div className="admin-state"><strong>{title}</strong>{text && <span>{text}</span>}{action}</div>;
}

export function SaveNotice({ status }) {
  if (!status?.message) return null;
  return <div className={`admin-save-notice admin-save-notice--${status.type || 'info'}`} role="status">{status.message}</div>;
}
