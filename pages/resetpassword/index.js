import React, { useState } from 'react';
import { useRouter } from 'next/router'
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
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
        verifyPasswordResetCode(auth, actionCode).then((email) => {
            const accountEmail = email;
            // Save the new password.
            confirmPasswordReset(auth, actionCode, newPassword).then((resp) => {
                // Password reset has been confirmed and new password updated.
                // Display a link back to the app, or sign-in the user directly
                // if the page is already from the app.
                toast.success("Password reset successful");
                //wait for 2 seconds and redirect to the continueUrl
                if (continueUrl) {
                    window.location.href = continueUrl;
                }
            }).catch((error) => {
                // Error occurred during confirmation.
                //The code might have expired or the password is too weak.
                toast.error(error.message);
            });
        }).catch((error) => {
            // Invalid or expired action code. Ask user to try to reset the password again.
            toast.error(error.message);
        });
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
