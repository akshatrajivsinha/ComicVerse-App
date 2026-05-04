import admin from "firebase-admin";
import crypto from "crypto";

const createUserByEmailFunction = async (req: any, res: any) => {
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

    // Check if email already exists in database
    const usersRef = admin.database().ref("users");
    const snapshot = await usersRef
      .orderByChild("email")
      .equalTo(userEmail)
      .once("value");

    if (snapshot.exists()) {
      return res.status(422).send({error: "Email already exists"});
    }

    // Create auth user with email
    const userRecord = await admin.auth().createUser({
      email: userEmail,
      password: password,
    });

    const code = Math.floor(Math.random() * 8999 + 1000);

    const userRef = admin.database().ref("users/" + userRecord.uid);
    await userRef.set({
      email: userEmail,
      password: hashedPassword,
      code,
      codeValid: true,
      createdAt: admin.database.ServerValue.TIMESTAMP,
      updatedAt: admin.database.ServerValue.TIMESTAMP,
      otpAttempts: 0,
      registrationCompleted: false,
      authToken: "",
    });

    return res.send({success: true, uid: userRecord.uid});
  } catch (error: any) {
    console.error("ERROR:", error);
    return res.status(500).send({error: error.message});
  }
};

export default createUserByEmailFunction;
