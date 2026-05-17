import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });

  const submit = async (event) => {
    event.preventDefault();
    const ok = await login(form);
    if (ok) navigate('/dashboard');
  };

  return (<main className="flex min-h-screen items-center justify-center bg-slate-950"><form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-xl bg-slate-900 p-8"><h1 className="text-2xl">Login</h1><input className="w-full rounded bg-slate-800 p-3" type="email" placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})} /><input className="w-full rounded bg-slate-800 p-3" type="password" placeholder="Password" onChange={(e)=>setForm({...form,password:e.target.value})} /><button disabled={loading} className="w-full rounded bg-indigo-600 p-3">{loading?'Signing in...':'Sign in'}</button>{error?.detail && <p className="text-red-400">{error.detail}</p>}<p>New here? <Link className="text-indigo-400" to="/signup">Create account</Link></p></form></main>);
}
