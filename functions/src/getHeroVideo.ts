import admin from "firebase-admin";

const getHeroVideoFunction = async (req: any, res: any) => {
  try {
    const db = admin.firestore();
    const heroVideoRef = db.collection("heroVideo");
    const snapshot = await heroVideoRef.get();

    const heroVideo = {
      videoUri: "https://www.youtube.com/watch?v=TcMBFSGVi1c&t=2s",
      poster: "https://cdn.arstechnica.net/wp-content/uploads/2019/04/avengers-endgame-listing-1152x648.png",
      categoryImage: "https://lumiere-a.akamaihd.net/v1/images/au_portrait_grid_marvel_logo_2025_mobile_1ad65200.png?region=0%2C0%2C1024%2C640",
      categoryTitle: "Marvel Studios: Avengers - Official Trailer",
    };

    if (snapshot.empty) {
      const docRef = heroVideoRef.doc();
      await docRef.set({
        ...heroVideo,
        id: docRef.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(200).json({
        success: true,
        data: {...heroVideo, id: docRef.id},
      });
    } else {
      const existingDoc = snapshot.docs[0];
      const docRef = heroVideoRef.doc(existingDoc.id);
      await docRef.update({
        ...heroVideo,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      const updatedSnapshot = await heroVideoRef.get();
      const heroVideoData = updatedSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.status(200).json({
        success: true,
        data: heroVideoData[0],
      });
    }
  } catch (error) {
    console.error("Error fetching hero video:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching hero video",
    });
  }
};

export default getHeroVideoFunction;
