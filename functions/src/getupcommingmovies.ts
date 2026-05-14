import admin from "firebase-admin";

const getupcommingmoviesFunction = async (req: any, res: any) => {
  try {
    const db = admin.firestore();
    const bannersRef = db.collection("upcomingMovies");
    const snapshot = await bannersRef.get();

    const banners = [
      {
        id: "1",
        imageUri:
          "https://imgix.bustle.com/uploads/image/2020/5/7/e189ed6c-fd49-4654-a9a9-e5bd72b75d7e-deadpool-mcu1.jpg?w=370&h=247&fit=crop&crop=focalpoint&dpr=2&fp-x=0.4846743295019157&fp-y=0.45689655172413796",
        title: "Deadpool 3",
        releaseDate: "Coming July 2026",
        rating: "9.2",
      },
      {
        id: "2",
        imageUri:
          "https://santabanta.b-cdn.net/image/cinema/big/2026/spider-man4-swings.jpg",
        title: "Spider-Man 4",
        releaseDate: "Coming 2027",
        rating: "9.5",
      },
      {
        id: "3",
        imageUri:
          "https://cdn.mos.cms.futurecdn.net/BYQpSzT2FZkLA7w2mYMgd.jpg",
        title: "Avengers: Doomsday",
        releaseDate: "Dec 2026",
        rating: "9.8",
      },
    ];

    const existingBanners = new Map();
    snapshot.docs.forEach((doc) => {
      existingBanners.set(doc.id, true);
    });

    const batch = db.batch();

    banners.forEach((banner) => {
      if (existingBanners.has(banner.id)) {
        // Update existing banner
        const docRef = bannersRef.doc(banner.id);
        batch.update(docRef, {
          imageUri: banner.imageUri,
          title: banner.title,
          releaseDate: banner.releaseDate,
          rating: banner.rating,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        // Create new banner
        const docRef = bannersRef.doc(banner.id);
        batch.set(docRef, {
          ...banner,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    });

    await batch.commit();

    const updatedSnapshot = await bannersRef.get();
    const bannersData = updatedSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      data: bannersData,
    });
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching upcoming movies",
    });
  }
};

export default getupcommingmoviesFunction;
