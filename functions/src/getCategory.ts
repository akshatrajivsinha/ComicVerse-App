import admin from "firebase-admin";

const getCategoryFunction = async (req: any, res: any) => {
  try {
    const db = admin.firestore();
    const categoriesRef = db.collection("categories");
    const snapshot = await categoriesRef.get();

    if (snapshot.empty) {
      const categories = [
        {
          name: "Marvel",
          image:
            "https://lumiere-a.akamaihd.net/v1/images/au_portrait_grid_marvel_logo_2025_mobile_1ad65200.png?region=0%2C0%2C1024%2C640",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        {
          name: "DC",
          image:
            "https://1000logos.net/wp-content/uploads/2017/01/DC-Comics-Logo-1972.png",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        {
          name: "Star Wars",
          image:
            "https://wallpapers.com/images/featured-full/star-wars-logo-xcw4lfbj6xjx2qvm.jpg",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
      ];

      const batch = db.batch();
      categories.forEach((category) => {
        const docRef = categoriesRef.doc();
        batch.set(docRef, {...category, id: docRef.id});
      });

      await batch.commit();

      // Fetch the newly created categories
      const newSnapshot = await categoriesRef.get();
      const categoriesData = newSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.status(200).json({
        success: true,
        data: categoriesData,
      });
    } else {
      // Return existing categories
      const categoriesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.status(200).json({
        success: true,
        data: categoriesData,
      });
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching categories",
    });
  }
};

export default getCategoryFunction;
