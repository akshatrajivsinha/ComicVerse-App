import admin from "firebase-admin";

const createUserBySocialLogin = async (req: any, res: any) => {
  try {
    const {email, name, uid, provider, authToken} = req.body;

    if (!email) {
      return res.status(422).send({error: "Email is required for social login"});
    }
    if (!uid) {
      return res.status(422).send({error: "UID is required for social sync"});
    }

    const userEmail = String(email).toLowerCase().trim();
    const usersRef = admin.database().ref("users");


    const snapshot = await usersRef
      .orderByChild("email")
      .equalTo(userEmail)
      .once("value");

    if (snapshot.exists()) {
      return res.send({
        success: true,
        message: "User synchronized successfully (Existing profile)",
        uid: uid,
      });
    }


    const userRef = admin.database().ref("users/" + uid);

    await userRef.set({
      email: userEmail,
      name: name || "",
      password: "",
      code: 0,
      codeValid: false,
      createdAt: admin.database.ServerValue.TIMESTAMP,
      updatedAt: admin.database.ServerValue.TIMESTAMP,
      otpAttempts: 0,
      registrationCompleted: true,
      authToken: authToken,
      provider: provider || "social",
    });

    return res.send({
      success: true,
      message: "User profile created successfully",
      uid: uid,
    });
  } catch (error: any) {
    console.error("ERROR IN SOCIAL LOGIN API:", error);
    return res.status(500).send({error: error.message});
  }
};

export default createUserBySocialLogin;
