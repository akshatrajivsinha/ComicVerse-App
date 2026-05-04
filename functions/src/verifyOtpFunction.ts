import admin from "firebase-admin";

const verifyOtpFunction = async (req: any, res: any) => {
  const {phone, email, code} = req.body;

  if (!code) {
    res.status(422).send({error: "Code must be provided"});
    return;
  }

  if (!phone && !email) {
    res.status(422).send({error: "Phone or email must be provided"});
    return;
  }

  const otpCode = parseInt(code);
  let userKey = "";

  try {
    if (email) {
      const userEmail = String(email).toLowerCase().trim();
      const usersRef = admin.database().ref("users");
      const snapshot = await usersRef
        .orderByChild("email")
        .equalTo(userEmail)
        .once("value");

      if (!snapshot.exists()) {
        return res.status(422).send({error: "User not found"});
      }

      const userData = snapshot.val();
      userKey = Object.keys(userData)[0];
    } else {
      const cleanPhone = String(phone).replace(/\D/g, "");
      await admin.auth().getUser(cleanPhone);
      userKey = cleanPhone;
    }

    const ref = admin.database().ref("users/" + userKey);
    const snapshot = await ref.once("value");
    const user = snapshot.val();

    if (user.code != otpCode) {
      return res.status(499).send({error: "Code is invalid"});
    }

    const token = await admin.auth().createCustomToken(userKey);
    await ref.update({authToken: token, registrationCompleted: true});
    res.status(200).send({success: true, token});
  } catch (err: any) {
    res.status(499).send({error: err.message || "Verification failed"});
  }
};

export default verifyOtpFunction;
