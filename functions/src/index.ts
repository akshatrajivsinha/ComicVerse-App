import {onRequest} from "firebase-functions/https";
import createUserFunction from "./createUserFunction";
import admin from "firebase-admin";
import requestOtpFunction from "./requestOtpFunction";
import verifyOtpFunction from "./verifyOtpFunction";
import createUserByEmailFunction from "./createUserByEmail";
import emailVerificationFunction from "./emailVerificationFunction";
import getCategoryFunction from "./getCategory";
import getShowListFunction from "./getShowList";
import getHeroVideoFunction from "./getHeroVideo";
import getMyStorieFunction from "./getMyStorie";
import getupcommingmoviesFunction from "./getupcommingmovies";
import getShowDetailBySlugFunction from "./getShowDetailBySlug";
// import serviceAccount from "./serviceAccount";

const serviceAccount = {
  "type": "service_account",
  "project_id": "one-time-password-4csc",
  "private_key_id": "0a9d51a1d451406d531bf8330f323c776fd2e55f",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDWCu09A3F2/DrA\nMltJFyJfEfVlXDZRH5IpZARp8Cbu9RKRUU00qKL3FK2c90IsBTVqBY5QvzXxDzlj\n4BwW3BJkKrqzTigtDqN5VGDLJbT7/HDe3tu4IUMcdSFbdxGOVfu2XvDM3jj3yv81\nlV6Y+1bIWgYUisiE0tM710l0g5UTOjy87mKd1NzixUx8xhCp0js7kBg8sRTYH+kJ\nXocL321FKuU76X2SIbzagtSA+8G/+A1mbDzCgQcpHLUDBwiFVpUJqFJPx4YocWHV\n/hIiv12zkNx/wkdEnm5CDbOhoVNdn7r7zPmvSwDcd6ObPx5yxPzBFvd9KSDkmPgl\nmPJ7RYRLAgMBAAECggEAR/MYWGAl7gdPgHfs857RMQAKa24Z3B8utLcoPKw7iivb\nd/nKaB8f2MqcqZz8I2wEzoTbmA0Oht/FPOuCxbRogj9Szx9AphS7ovdYKjGcqu/q\nySBE35pewtwkwGhAAIaqvF0huNwibjlQnKR/ThF+1I5eaN1WFkAAPaday83HeNSG\n292zccNF5rUNUrj2N06WR4SoJ0qMPQeX4yNwPWzgM0/iT0VPR9Lma81RScbHI5DH\ndovsYtjwgg5FtMKOy/gNEu7j8szL+yJ83RjcMnF59Kp3apF3k/JZu+uKaHz/GnMm\nq9M4m78f/TFvQnUAxIm0Io2o3pietHWTi1uSsULqkQKBgQD+AehYV8MYFSE92AiO\n92JvPFp58wNAujOniEO4lfU6gEds6yEspsxZXnEnuWplAF1BCefS0jRiknacM/Yb\nvm9j1o4fI2rdcOtWw0E7rJP1dbpSKuHlZQvT46lCUIchjekztGCqOyhFe+MCAuq0\n2hSWC5i/V8DXIHPMWPHEShakrwKBgQDXuMNA34WJSIFPvojU36GVftac3ubMPjrY\nrcIyFbsACB+3E4ATmKPND31uUXTD41+jTWT7KbZrnPYYZtmpsnzUP03mpOePx7Gk\nuXjXuYafpYLrDHhsaIhtWQJEyWGwUZqsMpmx8BtAW9ibIqJTUEmrAulMJ1eh6Cpg\nhcFBnKd5JQKBgQCc0Xat2/kBzEHKma6m/UpTXJKLSaIPeyXa38DXnBVbeckfEIdZ\nttzgq/L2UH3EP5ZTShdKzCY1WTFLPLVL6aWBoPv7c3VNo6JX3ZJPkjuCxp0yj3EJ\nm/nSZnKgE3FqIOAB4PHxBzbUtyiunDhlUWJ2RFCYiUfwSQPU/HC++/LA1wKBgFYD\nSn8MYL87VKwKKZ7PSCtGdqX3zoiza11H8v1rYrOBibvCn7ewjedOfNHG0srkVxbS\n3iezGxRPcmSKZdFe5JzwXMxRBi9zDSbD+SXyyHXRVaEIyN9Y0sTez6PDtBrMfuKY\nDmY/eW4w8O3yYkzb33O7ZnBB45Qf8P2pd0QFBVWtAoGBAI2KQm/SYcMP7pK9XyHX\nTF3NM5Hn4HKPpp9POVwNKfbUvb8TB7qxhjVrxSVNv6z9Q+fZ+CRSfJPa452zwzM1\n6xIzPAw1EoU/TBmTeSFgl7N7a8bqhh8mJBGAzO0Q9CklxVLIruN21CMtX/2zA4Ch\n/qkebf32IX3vRTJ+oYOhl2uD\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@one-time-password-4csc.iam.gserviceaccount.com",
  "client_id": "114318282715664207256",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40one-time-password-4csc.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com",
};

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
export const getCategory = onRequest(getCategoryFunction);
export const emailVerification = onRequest(emailVerificationFunction);
export const getShowList = onRequest(getShowListFunction);
export const getHeroVideo = onRequest(getHeroVideoFunction);
export const getMyStorie = onRequest(getMyStorieFunction);
export const getupcommingmovies = onRequest(getupcommingmoviesFunction);
export const getShowDetailBySlug = onRequest(getShowDetailBySlugFunction);
