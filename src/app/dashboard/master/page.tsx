import { redirect } from 'next/navigation';

export default function Page() {
  // Redirect to the list page by default
  redirect('/master/list-jalur');
}
