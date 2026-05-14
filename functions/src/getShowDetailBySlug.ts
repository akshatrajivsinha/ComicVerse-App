import admin from "firebase-admin";

const getShowDetailBySlug = async (req: any, res: any) => {
  try {
    const slug = String(req.body.slug || "");

    if (!slug) {
      return res.status(400).send({
        success: false,
        message: "Slug is required",
      });
    }

    const db = admin.database();

    const showDetailRef = db.ref("showDetail");

    const snapshot = await showDetailRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).send({
        success: false,
        message: "Show detail not found in Realtime Database",
      });
    }

    const showDetail = snapshot.val();

    const matchedShow = showDetail.find(
      (item: any) => item.slug === slug
    );

    if (!matchedShow) {
      return res.status(404).send({
        success: false,
        message: "Show not found",
      });
    }

    return res.status(200).send({
      success: true,
      data: matchedShow,
    });
  } catch (error) {
    console.log("Error fetching show detail:", error);

    return res.status(500).send({
      success: false,
      message: "Error fetching show detail",
      error,
    });
  }
};

export default getShowDetailBySlug;
