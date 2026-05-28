import AdminShell from '@/components/layout/AdminShell';

export const metadata = { title: 'Admin — FinSights' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
