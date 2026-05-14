import admin from "firebase-admin";

const getCategoryFunction = async (req: any, res: any) => {
  try {
    const db = admin.firestore();
    const categoriesRef = db.collection("categories");

    const categories = [
      {
        name: "Marvel",
        image:
          "https://lumiere-a.akamaihd.net/v1/images/au_portrait_grid_marvel_logo_2025_mobile_1ad65200.png?region=0%2C0%2C1024%2C640",
      },
      {
        name: "DC",
        image:
          "https://1000logos.net/wp-content/uploads/2017/01/DC-Comics-Logo-1972.png",
      },
      {
        name: "Star Wars",
        image:
          "https://wallpapers.com/images/featured-full/star-wars-logo-xcw4lfbj6xjx2qvm.jpg",
      },
      {
        name: "Manga",
        image:
          "https://www.hanashi.fr/wp-content/uploads/2025/12/manga_plus_ban-1500x500.jpg",
      },
      {
        name: "Dark Horse",
        image:
          "https://substackcdn.com/image/fetch/$s_!Iofg!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F174c4281-862f-4eb8-a853-6fa21b5efe6f_3400x2175.png",
      },
    ];

    // Fetch existing categories
    const snapshot = await categoriesRef.get();

    const existingCategories = new Map();
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      existingCategories.set(data.name, doc.id);
    });

    const batch = db.batch();

    categories.forEach((category) => {
      if (existingCategories.has(category.name)) {
        // Update existing category
        const docRef = categoriesRef.doc(existingCategories.get(category.name));
        batch.update(docRef, {
          image: category.image,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        // Create new category
        const docRef = categoriesRef.doc();
        batch.set(docRef, {
          ...category,
          id: docRef.id,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    });

    await batch.commit();

    // Fetch updated data
    const updatedSnapshot = await categoriesRef.get();

    const categoriesData = updatedSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      data: categoriesData,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);

    res.status(500).json({
      success: false,
      error: "Error fetching categories",
    });
  }
};

export default getCategoryFunction;
