import admin from "firebase-admin";
import crypto from "crypto";

const emailVerificationFunction = async (req: any, res: any) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(422).send("Email and password are required");
    }

    const userEmail = String(email).toLowerCase().trim();
    const hashedPassword = crypto
      .createHash("sha1")
      .update(password)
      .digest("hex");

    // Check if email exists in database
    const usersRef = admin.database().ref("users");
    const snapshot = await usersRef
      .orderByChild("email")
      .equalTo(userEmail)
      .once("value");

    if (!snapshot.exists()) {
      return res.status(422).send({error: "Email not found"});
    }

    // Get user data
    const userData = snapshot.val();
    const userKey = Object.keys(userData)[0];
    const user = userData[userKey];

    // Verify password
    if (user.password !== hashedPassword) {
      return res.status(422).send({error: "Invalid password"});
    }

    // Create custom token and update database
    const token = await admin.auth().createCustomToken(userKey);
    const userRef = admin.database().ref("users/" + userKey);
    await userRef.update({
      authToken: token,
      registrationCompleted: true,
    });

    return res.send({success: true, token: token});
  } catch (error: any) {
    console.error("ERROR:", error);
    return res.status(500).send({error: error.message});
  }
};

export default emailVerificationFunction;
