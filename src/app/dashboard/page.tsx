import { cookies } from 'next/headers';
import { verifyToken } from '../lib/Token';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const cookieStore = await cookies();
  // Esto solo pregunta si existe, pero el resultado sigue siendo string | undefined
  const token = cookieStore.get('token')?.value;
  // Si no existe, redirige
    if (!token) {
    redirect('/'); 
  }
  const user = await verifyToken(token);

    if (!user) {
    redirect('/'); 
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Token: {user.role}</p>
    </div>
  );
}