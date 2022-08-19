import { useEffect } from "react";
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter();
  const { mode, oobCode, continueUrl, lang, apiKey } = router.query;

  useEffect(() => {

    // Handle the user management action.
    switch (mode) {
      case 'resetPassword':
        // Display reset password handler and UI.
        router.push({
          pathname: '/resetpassword',
          query: {
            mode,
            oobCode,
            continueUrl,
            lang,
            apiKey,
          }
        });
        break;
      case 'recoverEmail':
        // Display email recovery handler and UI.
        router.push({
          pathname: '/recoveremail',
          query: {
            mode: 'recoverEmail',
            oobCode: oobCode,
            continueUrl: continueUrl,
            lang: lang
          }
        });
        // handleRecoverEmail(auth, actionCode, lang);
        break;
      case 'verifyEmail':
        // Display email verification handler and UI.
        router.push({
          pathname: '/verifyemail',
          query: {
            mode: 'verifyEmail',
            oobCode: oobCode,
            continueUrl: continueUrl,
            lang: lang
          }
        });
        // handleVerifyEmail(auth, actionCode, continueUrl, lang);
        break;
      default:
      // Error: invalid mode.
    }

  }, [mode]);

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
