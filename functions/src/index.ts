import {onRequest} from "firebase-functions/https";
import createUserFunction from "./createUserFunction";
import admin from "firebase-admin";
import requestOtpFunction from "./requestOtpFunction";
import verifyOtpFunction from "./verifyOtpFunction";
import createUserByEmailFunction from "./createUserByEmail";
import emailVerificationFunction from "./emailVerificationFunction";
import serviceAccount from "./serviceAccount.json";

if (!serviceAccount.private_key || !serviceAccount.client_email) {
  throw new Error(
    "Missing Firebase service account credentials in environment variables",
  );
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://one-time-password-4csc-default-rtdb.asia-southeast1.firebasedatabase.app/",
});

export const createUser = onRequest(createUserFunction);
export const requestOneTimePassword = onRequest(requestOtpFunction);
export const verifyOneTimePassword = onRequest(verifyOtpFunction);
export const createUserByEmail = onRequest(createUserByEmailFunction);
export const emailVerification = onRequest(emailVerificationFunction);
