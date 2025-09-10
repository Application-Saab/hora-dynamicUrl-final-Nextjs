import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ShareTargetPage() {
  const router = useRouter();

  useEffect(() => {
    if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
      window.launchQueue.setConsumer(async (launchParams) => {
        if (!launchParams.files.length) return;

        for (const fileHandle of launchParams.files) {
          const file = await fileHandle.getFile();
          console.log("Shared file:", file);
        }
      });
    }

    // Optional: redirect or handle data
    // router.push('/');
  }, []);

  return (
    <div>
      <h1>Shared Data Received</h1>
      <p>Handling incoming shared content...</p>
    </div>
  );
}
