import CodeCheck from '@/components/CodeCheck';
import { redirect } from 'next/navigation';

export default function Home() {
  // On the main page, we redirect to the dashboard for a mobile-first experience.
  // The dress code checker can be a tab or section within the student dashboard.
  redirect('/dashboard');

  return (
    <div className="container mx-auto p-4 md:p-8">
      <CodeCheck />
    </div>
  );
}
