import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '../lib/Token';

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) {
    redirect('/');
  }
  
  const user = await verifyToken(token);
  
  if (!user) {
    redirect('/');
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Bienvenido, {user.Usuario}!</p>
      <p>Rol: {user.role}</p>
    </div>
  );
}

// ⭐ IMPORTANTE: Esto hace que la página sea dinámica
export const dynamic = 'force-dynamic';