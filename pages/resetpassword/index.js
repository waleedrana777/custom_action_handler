import React, { useState } from 'react';
import { useRouter } from 'next/router'
import { checkActionCode, applyActionCode, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from "../../firebase/db.js";

export default function ResetPassword() {
    const [pass, setPass] = useState("");
    const router = useRouter();

    const {
        oobCode,
        continueUrl,
    } = router.query;


    function handleResetPassword(newPassword, actionCode) {
        // Verify the password reset code is valid.
        checkActionCode(auth, actionCode).then(
            verifyPasswordResetCode(auth, actionCode).then((email) => {
                const accountEmail = email;

                // Save the new password.
                confirmPasswordReset(auth, actionCode, newPassword).then((resp) => {

                    // action code has been used, password has been updated
                    applyActionCode(auth, actionCode);

                    // Password reset has been confirmed and new password updated.
                    // Display a link back to the app, or sign-in the user directly
                    // if the page is already from the app.
                    toast.success("Password reset successful for " + accountEmail);

                    //wait for 2 seconds and redirect to the continueUrl
                    setTimeout(() => {
                        if (continueUrl) {
                            window.location.href = continueUrl;
                        }
                    }, 2000);
                }).catch((error) => {
                    // Error occurred during confirmation.
                    //The code might have expired or the password is too weak.
                    toast.error(error.message);
                });
            }).catch((error) => {
                // Invalid or expired action code. Ask user to try to reset the password again.
                toast.error(error.message);
            })
        ).catch((error) => {
            // Invalid or expired action code. Ask user to try to reset the password again.
            toast.error("Code is invalid or expired.Ask the user to verify their email address again.");
        }
        );
    }

    function resetPassHandler(e) {
        e.preventDefault();
        handleResetPassword(pass, oobCode);
    }

    return (
        <div>
            <ToastContainer />
            <h1>Reset Password</h1>
            <p>Enter your new password</p>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
            <button onClick={resetPassHandler}>Submit</button>
        </div>
    )
}
