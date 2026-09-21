import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { isSupabaseConfigured } from '../../lib/supabase';
import { useAdminAuth } from '../AdminAuthContext';
import AdminLanguageSwitcher from '../components/AdminLanguageSwitcher';
import { useAdminLanguage } from '../i18n/AdminLanguageContext';

export default function AdminLoginPage() {
  const { user, loading, error: authError, signIn } = useAdminAuth();
  const { locale, t } = useAdminLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const authMessage = authError === 'AUTH_NO_PERMISSION' ? t('auth.noPermission')
    : authError === 'SUPABASE_MISSING' ? t('auth.supabaseMissing')
      : authError === 'LOGIN_FAILED' ? t('auth.loginFailed')
        : authError ? t('auth.sessionError') : '';

  useEffect(() => {
    document.body.dataset.page = 'admin-login';
    document.title = `${t('auth.loginTitle')} — Hlime Admin`;
  }, [locale, t]);

  if (user && !loading) return <Navigate to={location.state?.from || '/admin'} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setFormError('');
    try {
      await signIn(email.trim(), password);
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (error) {
      setFormError(error.message === 'ADMIN_ALLOWLIST_REQUIRED' ? t('auth.noPermission') : t('auth.loginFailed'));
    }
  };

  return (
    <main className="admin-login">
      <form className="admin-login__card" onSubmit={submit}>
        <div className="admin-login__top"><div className="admin-brand"><strong>Hlime</strong><span>Admin V1</span></div><AdminLanguageSwitcher /></div>
        <div><h1>{t('auth.loginTitle')}</h1><p>{t('auth.loginDescription')}</p></div>
        <label className="admin-field"><span>Email</span><input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label className="admin-field"><span>{t('auth.password')}</span><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        {(formError || authError || !isSupabaseConfigured) && <p className="admin-form-error" role="alert">{formError || authMessage || t('auth.supabaseMissing')}</p>}
        <button className="admin-button admin-button--primary admin-button--full" type="submit" disabled={loading || !isSupabaseConfigured}>{loading ? t('auth.loggingIn') : t('auth.login')}</button>
      </form>
    </main>
  );
}
