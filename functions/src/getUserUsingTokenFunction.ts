import admin from "firebase-admin";

const getUserUsingTokenFunction = async (req: any, res: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({error: "Unauthorized: Missing or invalid token format"});
    }

    const token = authHeader.split("Bearer ")[1];

    const usersRef = admin.database().ref("users");
    const snapshot = await usersRef
      .orderByChild("authToken")
      .equalTo(token)
      .once("value");


    if (!snapshot.exists()) {
      return res.status(404).send({error: "Session expired or invalid token."});
    }

    const matches = snapshot.val();
    const uids = Object.keys(matches);
    const uid = uids[0];
    const userData = matches[uid];

    if (userData.password) {
      delete userData.password;
    }

    userData.uid = uid;

    return res.send({
      success: true,
      user: userData,
    });
  } catch (error: any) {
    console.error("ERROR FETCHING USER BY DB TOKEN:", error);
    return res.status(500).send({error: error.message});
  }
};

export default getUserUsingTokenFunction;
