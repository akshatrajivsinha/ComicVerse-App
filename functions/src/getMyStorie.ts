import admin from "firebase-admin";

const getMyStorieFunction = async (req: any, res: any) => {
  try {
    const db = admin.firestore();
    const storiesRef = db.collection("stories");
    const snapshot = await storiesRef.get();

    const stories = [
      {
        id: "1",
        imageUri:
          "https://m.media-amazon.com/images/I/91RpwagB7uL._AC_UF1000,1000_QL80_.jpg",
        smallImageUri:
          "https://www.hanashi.fr/wp-content/uploads/2025/12/manga_plus_ban-1500x500.jpg",
        category: "Manga",
        title: "Naruto - The epic adventures of the world's greatest ninja!",
      },
      {
        id: "2",
        imageUri:
          "https://media.newyorker.com/photos/593581e785bd115baccba6d2/master/pass/Lane-Ten-Things-about-Wonder-Woman.jpg",
        smallImageUri:
          "https://1000logos.net/wp-content/uploads/2017/01/DC-Comics-Logo-1972.png",
        category: "DC",
        title: "Wonder Woman - is a 2017 superhero film based on the DC Comics character Wonder Woman.",
      },
    ];

    const existingStories = new Map();
    snapshot.docs.forEach((doc) => {
      existingStories.set(doc.id, true);
    });

    const batch = db.batch();

    stories.forEach((story) => {
      if (existingStories.has(story.id)) {
        // Update existing story
        const docRef = storiesRef.doc(story.id);
        batch.update(docRef, {
          imageUri: story.imageUri,
          smallImageUri: story.smallImageUri,
          category: story.category,
          title: story.title,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        // Create new story
        const docRef = storiesRef.doc(story.id);
        batch.set(docRef, {
          ...story,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    });

    await batch.commit();

    const updatedSnapshot = await storiesRef.get();
    const storiesData = updatedSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      data: storiesData,
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching stories",
    });
  }
};

export default getMyStorieFunction;
