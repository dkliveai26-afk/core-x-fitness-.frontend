import { redirect } from 'next/navigation';

export default function CoreXAdminRedirectPage() {
  redirect('/admin/dashboard');
}
