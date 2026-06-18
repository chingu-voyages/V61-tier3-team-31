import {redirect} from 'next/navigation';

/** Startseite leitet auf Login weiter */
export default function Home() {
  redirect('/login');
}
