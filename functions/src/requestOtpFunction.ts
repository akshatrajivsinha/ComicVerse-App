import admin from "firebase-admin";

const requestOtpFunction = async (req: any, res: any) => {
  try {
    const {phone, type} = req.body;

    if (!phone || !type) {
      return res
        .status(422)
        .send("You must provide phone and type (login/register)");
    }

    const cleanPhone = String(phone).replace(/\D/g, "");
    const userRef = admin.database().ref("users/" + cleanPhone);
    const snapshot = await userRef.get();

    let userExists = true;

    if (!snapshot.exists()) {
      userExists = false;
    }

    if (type === "login") {
      if (
        !userExists ||
        (snapshot.val().registrationCompleted !== true)
      ) {
        return res
          .status(422)
          .send({
            error: "User not found or not registered. Please register first.",
          });
      }
    }

    if (type === "register") {
      if (!userExists) {
        await admin.auth().createUser({uid: cleanPhone});
      } else {
        return res.status(422).send({error: "User already exist."});
      }
    }

    const code = Math.floor(Math.random() * 8999 + 1000);

    if (!snapshot.exists()) {
      await userRef.set({
        phone: cleanPhone,
        code,
        codeValid: true,
        createdAt: admin.database.ServerValue.TIMESTAMP,
        updatedAt: admin.database.ServerValue.TIMESTAMP,
        otpAttempts: 0,
        registrationCompleted: false,
        authToken: "",
      });
    } else {
      await userRef.update({
        code,
        codeValid: true,
        updatedAt: admin.database.ServerValue.TIMESTAMP,
        registrationCompleted: false,
        authToken: "",
      });
    }

    return res.send({success: true});
  } catch (error: any) {
    console.error("ERROR:", error);
    return res.status(500).send({error: error.message});
  }
};

export default requestOtpFunction;
