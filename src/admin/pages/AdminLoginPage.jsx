import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { isSupabaseConfigured } from '../../lib/supabase';
import { useAdminAuth } from '../AdminAuthContext';

export default function AdminLoginPage() {
  const { user, loading, error: authError, signIn } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.dataset.page = 'admin-login';
    document.title = 'Đăng nhập — Hlime Admin';
  }, []);

  if (user && !loading) return <Navigate to={location.state?.from || '/admin'} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setFormError('');
    try {
      await signIn(email.trim(), password);
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (error) {
      setFormError(error.message);
    }
  };

  return (
    <main className="admin-login">
      <form className="admin-login__card" onSubmit={submit}>
        <div className="admin-brand"><strong>Hlime</strong><span>Admin V1</span></div>
        <div><h1>Đăng nhập Admin</h1><p>Dùng tài khoản Email + Password đã được owner thêm vào allowlist.</p></div>
        <label className="admin-field"><span>Email</span><input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label className="admin-field"><span>Mật khẩu</span><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        {(formError || authError || !isSupabaseConfigured) && <p className="admin-form-error" role="alert">{formError || authError || 'Thiếu Supabase environment variables.'}</p>}
        <button className="admin-button admin-button--primary admin-button--full" type="submit" disabled={loading || !isSupabaseConfigured}>{loading ? 'Đang kiểm tra…' : 'Đăng nhập'}</button>
      </form>
    </main>
  );
}
