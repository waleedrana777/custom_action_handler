import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { checkActionCode, applyActionCode } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from "../../firebase/db.js";

export default function VerifyEmail() {
    const router = useRouter();

    const [pass, setPass] = useState("");
    const [email, setEmail] = useState("");
    const [verified, setVerified] = useState(false);
    const [continueUrl, setContinueUrl] = useState("");

    useEffect(() => {
        if (!router.isReady) return;
        const {
            mode,
            oobCode,
            lang,
            email,
        } = router.query;

        setContinueUrl(
            router.query.continueUrl ?
                router.query.continueUrl + "?reload=true"
                : "Home");

        function verifyEmailSuccess(actionCode) {
            setVerified(false);
            //check the action code if it is valid
            checkActionCode(auth, actionCode).then(
                //if valid, apply the action code
                applyActionCode(auth, actionCode)
                    .then(() => {
                        // Email address has been verified.
                        setEmail(email);
                        setVerified(true);
                        toast.success("Email verified for " + email);

                        // wait for 2 seconds and redirect to the continueUrl
                        // setTimeout(() => {
                        //     if (continueUrl) {
                        //         window.location.href = continueUrl;
                        //     }
                        // }, 2000);
                    })
                    .catch(error => {
                        toast.error("Error verifying email");
                        if (error.code === 'auth/user-not-found') {
                            toast.error("404: User not found");
                        }
                        if (error.code === 'auth/invalid-continue-uri') {
                            toast.error("401: Invalid redirect URL");
                        }
                        toast.error("500: Unhandled Server error: " + error.message);
                    })
            ).catch(error => {
                toast.error("Code is invalid or expired.Ask the user to verify their email address again.");
            });
        }

        verifyEmailSuccess(oobCode);
    }, [router.isReady]);

    return (
        <div>
            <ToastContainer />
            {verified ? (
                <>
                    <h1>{email} is verified</h1>
                    <p>Redirecting to </p>
                    <a href={continueUrl}>{continueUrl}</a>
                    <p>...</p>
                    <button
                        onClick={
                            () => {
                                window.location.href = "https://firebase-auth-and-crud.vercel.app/?reload=true";
                            }
                        }
                    >Go back to home</button>
                </>)
                : <h1>Verifying email...</h1>
            }
        </div>
    )
}
