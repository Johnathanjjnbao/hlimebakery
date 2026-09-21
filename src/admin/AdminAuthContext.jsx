import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { requireSupabase, supabase } from '../lib/supabase';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const verifyAdmin = useCallback(async (candidate) => {
    if (!candidate || !supabase) {
      setUser(null);
      setLoading(false);
      return false;
    }

    const { data, error: allowlistError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', candidate.id)
      .maybeSingle();

    if (allowlistError || !data) {
      setUser(null);
      setError(allowlistError?.message || 'Tài khoản này không có quyền truy cập Admin.');
      await supabase.auth.signOut();
      setLoading(false);
      return false;
    }

    setUser(candidate);
    setError('');
    setLoading(false);
    return true;
  }, []);

  useEffect(() => {
    let active = true;
    const restore = async () => {
      if (!supabase) {
        if (active) {
          setError('Supabase chưa được cấu hình.');
          setLoading(false);
        }
        return;
      }
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (!active) return;
      if (sessionError) {
        setError(sessionError.message);
        setLoading(false);
        return;
      }
      await verifyAdmin(data.session?.user || null);
    };
    restore();

    const { data: listener } = supabase?.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => {
        if (active) verifyAdmin(session?.user || null);
      }, 0);
    }) || { data: null };

    return () => {
      active = false;
      listener?.subscription?.unsubscribe();
    };
  }, [verifyAdmin]);

  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    setError('');
    const client = requireSupabase();
    const { data, error: signInError } = await client.auth.signInWithPassword({ email, password });
    if (signInError) {
      setLoading(false);
      setError(signInError.message);
      throw signInError;
    }
    const allowed = await verifyAdmin(data.user);
    if (!allowed) throw new Error('Tài khoản này không nằm trong Admin allowlist.');
    return data.user;
  }, [verifyAdmin]);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, error, signIn, signOut }), [error, loading, signIn, signOut, user]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const value = useContext(AdminAuthContext);
  if (!value) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return value;
}
