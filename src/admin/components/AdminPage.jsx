export default function AdminPage({ title, description, action, children }) {
  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div><h1>{title}</h1>{description && <p>{description}</p>}</div>
        {action && <div className="admin-page__action">{action}</div>}
      </header>
      {children}
    </div>
  );
}
