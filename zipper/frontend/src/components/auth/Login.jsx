// frontend/src/components/auth/Login.jsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn } from 'lucide-react';
import Logo from '@/components/Logo'; // 1. Import the new Logo component

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signUp, logIn, signInWithGoogle } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await logIn(email, password);
            } else {
                await signUp(email, password);
            }
            // 2. Update redirect path to match your page.jsx
            router.push('/dashboard/Home');
        } catch (err) {
            setError(err.message.replace('Firebase: ', ''));
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            // 2. Update redirect path to match your page.jsx
            router.push('/dashboard/Home');
        } catch (err) {
            setError(err.message.replace('Firebase: ', ''));
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            

            <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-800">{isLogin ? 'Welcome Back!' : 'Create Account'}</h1>
                <p className="text-slate-500">{isLogin ? 'Sign in to continue' : 'Get started for free'}</p>
            </div>

            {error && <div className="p-3 text-center text-sm text-red-700 bg-red-100 rounded-md">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500" />
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500" />
                    </div>
                </div>
                <button type="submit" className="w-full flex justify-center items-center gap-2 py-2 px-4 text-white font-semibold bg-slate-800 rounded-md hover:bg-slate-900 transition-colors">
                    <LogIn size={20} />
                    {isLogin ? 'Log In' : 'Sign Up'}
                </button>
            </form>

            <div className="text-center text-sm">
                <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 hover:underline">
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                </button>
            </div>

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or</span></div>
            </div>

            <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-3 py-2 px-4 border rounded-md hover:bg-gray-50 transition">
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C41.38,36.218,44,30.668,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
                Sign in with Google
            </button>
        </div>
    );
}