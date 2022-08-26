import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { checkActionCode, applyActionCode } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../../firebase/db.js";

export default function VerifyEmail() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [verified, setVerified] = useState(false);
    const [continueUrl, setContinueUrl] = useState("");

    useEffect(() => {
        if (!router.isReady) return;

        const { mode, actionCode, email, lang } = router.query;

        setContinueUrl(
            router.query.continueUrl ? router.query.continueUrl + "?reload=true" : ""
        );

        function verifyEmailSuccess() {
            setVerified(false);

            //check the action code if it is valid
            checkActionCode(auth, actionCode).then(actionCodeInfo => {
                toast.success("Code verified");

                //if valid, apply the action code
                applyActionCode(auth, actionCode)
                    .then(
                        resp => {
                            toast.success("Code applied successfully");

                            // Email address has been verified.
                            setEmail(email);
                            setVerified(true);

                            toast.success("Email address verified for " + email);
                            toast.success("Redirecting --> " + continueUrl);

                            // wait for 2 seconds and redirect to the continueUrl
                            setTimeout(() => {
                                if (continueUrl) {
                                    window.location.href = continueUrl;
                                }
                            }, 2000);
                        },
                        error => {
                            setError(true);
                            if (error.code === "auth/user-not-found") {
                                toast.error("Error verifying email 404: User not found");
                            } else if (error.code === "auth/invalid-continue-uri") {
                                toast.error("Error verifying email 401: Invalid redirect URL");
                            } else {
                                toast.error("Unhandled Server Error 500: " + error.message);
                            }
                        }
                    )
                    .catch(error => {
                        toast.error(
                            "Link is invalid or expired.Ask the user to verify their email address again."
                        );
                    });
            });
        }

        verifyEmailSuccess();
    }, [router.isReady]);

    return (
        <div>
            <ToastContainer />
            {verified ? (
                <>
                    <h1>{email} is verified</h1>
                    <button
                        onClick={() => {
                            window.location.href =
                                "https://firebase-auth-and-crud.vercel.app/?reload=true";
                        }}>
                        Go back to home
                    </button>
                </>
            ) : error ? (
                <h1> Failed due to error</h1>
            ) : (
                <h1> Verifying email...</h1>
            )}
        </div>
    );
}
