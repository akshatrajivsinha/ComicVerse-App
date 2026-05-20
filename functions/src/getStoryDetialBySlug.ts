import admin from "firebase-admin";

const getStoryDetialBySlug = async (req: any, res: any) => {
  try {
    const slug = String(req.body.slug || "");

    if (!slug) {
      return res.status(400).send({
        success: false,
        message: "Slug is required",
      });
    }

    const db = admin.database();
    const storyPageListRef = db.ref("storyPageList");

    const snapshot = await storyPageListRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).send({
        success: false,
        message: "Story page list not found in Realtime Database",
      });
    }

    const storyPageList = snapshot.val();
    const stories = Array.isArray(storyPageList) ?
      storyPageList :
      Object.values(storyPageList);

    const matchedStory = stories.find(
      (item: any) => item.slug === slug,
    );

    if (!matchedStory) {
      return res.status(404).send({
        success: false,
        message: "Story not found",
      });
    }

    return res.status(200).send({
      success: true,
      data: matchedStory,
    });
  } catch (error) {
    console.log("Error fetching story detail:", error);

    return res.status(500).send({
      success: false,
      message: "Error fetching story detail",
      error,
    });
  }
};

export default getStoryDetialBySlug;
