import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, loading, error } = useAuthStore();
  const [form, setForm] = useState({ email: '', username: '', first_name: '', last_name: '', password: '', confirm_password: '' });

  const submit = async (event) => {
    event.preventDefault();
    const ok = await signup(form);
    if (ok) navigate('/dashboard');
  };

  return (<main className="flex min-h-screen items-center justify-center bg-slate-950"><form onSubmit={submit} className="w-full max-w-md space-y-3 rounded-xl bg-slate-900 p-8"><h1 className="text-2xl">Signup</h1>{['email','username','first_name','last_name','password','confirm_password'].map((field)=><input key={field} className="w-full rounded bg-slate-800 p-3" type={field.includes('password')?'password':'text'} placeholder={field} onChange={(e)=>setForm({...form,[field]:e.target.value})} />)}<button disabled={loading} className="w-full rounded bg-indigo-600 p-3">{loading?'Creating...':'Create account'}</button>{error && <p className="text-red-400">{JSON.stringify(error)}</p>}<p>Have an account? <Link className="text-indigo-400" to="/login">Sign in</Link></p></form></main>);
}
