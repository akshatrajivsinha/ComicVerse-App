import admin from "firebase-admin";
import crypto from "crypto";

const uploadDataUrlToStorage = async (
  dataUrl: string,
  uid: string,
  type: "cover" | "profile",
): Promise<string> => {
  const matches = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!matches) throw new Error("Invalid data URL format");

  const contentType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, "base64");
  const ext = contentType.split("/")[1] || "jpg";
  const fileName = `profiles/${uid}/${type}_${Date.now()}.${ext}`;

  const bucket = admin.storage().bucket("one-time-password-4csc.firebasestorage.app");
  const file = bucket.file(fileName);
  const downloadToken = crypto.randomUUID();

  await file.save(buffer, {
    contentType,
    metadata: {firebaseStorageDownloadTokens: downloadToken},
  });

  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${downloadToken}`;
};

const updateUserProfileFunction = async (req: any, res: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({error: "Unauthorized: Missing or invalid token format"});
    }

    const token = authHeader.split("Bearer ")[1];
    let {profileName, coverImage, profileImage} = req.body;

    const usersRef = admin.database().ref("users");
    const snapshot = await usersRef
      .orderByChild("authToken")
      .equalTo(token)
      .once("value");

    if (!snapshot.exists()) {
      return res.status(404).send({error: "Session expired or invalid token."});
    }

    const matches = snapshot.val();
    const uid = Object.keys(matches)[0];

    if (coverImage && coverImage.startsWith("data:")) {
      coverImage = await uploadDataUrlToStorage(coverImage, uid, "cover");
    }
    if (profileImage && profileImage.startsWith("data:")) {
      profileImage = await uploadDataUrlToStorage(profileImage, uid, "profile");
    }

    const updates: any = {};
    if (profileName !== undefined) updates.profileName = profileName;
    if (coverImage !== undefined) updates.coverImage = coverImage;
    if (profileImage !== undefined) updates.profileImage = profileImage;

    if (Object.keys(updates).length === 0) {
      return res.status(400).send({error: "No valid profile fields provided for update."});
    }

    await usersRef.child(uid).update(updates);

    const updatedSnapshot = await usersRef.child(uid).once("value");
    const updatedUserData = updatedSnapshot.val();

    if (updatedUserData.password) {
      delete updatedUserData.password;
    }
    updatedUserData.uid = uid;

    return res.send({
      success: true,
      message: "Profile updated successfully",
      user: updatedUserData,
    });
  } catch (error: any) {
    console.error("ERROR UPDATING USER PROFILE:", error);
    return res.status(500).send({error: error.message});
  }
};

export default updateUserProfileFunction;
