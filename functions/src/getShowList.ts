import admin from "firebase-admin";

const getShowListFunction = async (req: any, res: any) => {
  try {
    const db = admin.firestore();
    const showsRef = db.collection("shows");

    const defaultShows = [
      {
        title: "Star Wars: The Force Awakens",
        image: "https://m.media-amazon.com/images/S/pv-target-images/5711853501daeb53006436b7d849359efc4316fab8d8826e5a011dc652ca1cd8.jpg",
        slug: "star-war-force-awakens",
      },
      {
        title: "Zack Snyder's Justice League",
        image: "https://imageio.forbes.com/specials-images/imageserve/6052580b2b9711b7822ff1cf/0x0.jpg?format=jpg&height=600&width=1200&fit=bounds",
        slug: "zack-snyder-justice-league",
      },
      {
        title: "Iron Man 2",
        image: "https://img1.hotstarext.com/image/upload/f_auto/sources/r1/cms/prod/4331/644331-h",
        slug: "iron-man",
      },
      {
        title: "Black Adam",
        image: "https://images.yourstory.com/cs/210/d72b5ef09db411ebb4167b901dac470c/Imageld6a-1666269188044.jpg?mode=crop&crop=faces&ar=2%3A1&format=auto&w=1920&q=75",
        slug: "black-adam",
      },
      {
        title: "The Batman",
        image: "https://images.thedirect.com/media/article_full/batman-sequel.jpg?imgeng=/cmpr_60/w_1280",
        slug: "the-batman",
      },
    ];

    // Fetch existing shows
    const snapshot = await showsRef.get();

    const existingShows = new Map();
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      existingShows.set(data.slug, doc.id);
    });

    const batch = db.batch();

    defaultShows.forEach((show) => {
      if (existingShows.has(show.slug)) {
        // Update existing show
        const docRef = showsRef.doc(existingShows.get(show.slug));
        batch.update(docRef, {
          image: show.image,
          title: show.title,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        // Create new show
        const docRef = showsRef.doc();
        batch.set(docRef, {
          ...show,
          id: docRef.id,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    });

    await batch.commit();

    // Fetch updated data
    const updatedSnapshot = await showsRef.get();

    const showsData = updatedSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      data: showsData,
    });
  } catch (error) {
    console.error("Error fetching shows:", error);

    res.status(500).json({
      success: false,
      error: "Error fetching shows",
    });
  }
};

export default getShowListFunction;
