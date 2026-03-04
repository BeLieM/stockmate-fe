import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Ganti URL pake endpoint API backend yang udah ready
      const response = await fetch('https://api.domainkamu.com/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login gagal. Silakan periksa kembali email dan password Anda.');
      }

      // TODO: Simpan token autentikasi (misal: localStorage atau Cookies) di sini
      
      // Redirect ke page dashboard kalau sukses
      router.push('/dashboard');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};