import { redirect } from 'next/navigation';

export default function Home() {
  // On the main page, we redirect to the dashboard for a mobile-first experience.
  redirect('/dashboard');
}
