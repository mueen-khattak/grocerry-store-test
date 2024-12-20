// app/page.js (Server Component)
import dynamic from 'next/dynamic';


const ConfirmEmailClient = dynamic(() => import('./ConfirmEmailClient'), { ssr: false });

export default function Account_setting_Page() {
  return (
      <ConfirmEmailClient /> 
 
  );
}
