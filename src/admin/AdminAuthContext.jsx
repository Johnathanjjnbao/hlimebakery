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
      setError('AUTH_NO_PERMISSION');
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
          setError('SUPABASE_MISSING');
          setLoading(false);
        }
        return;
      }
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (!active) return;
      if (sessionError) {
        setError('SESSION_ERROR');
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
      setError('LOGIN_FAILED');
      throw signInError;
    }
    const allowed = await verifyAdmin(data.user);
    if (!allowed) throw new Error('ADMIN_ALLOWLIST_REQUIRED');
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
