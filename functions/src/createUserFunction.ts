import admin from "firebase-admin";

const createUserFunction = (req: any, res: any) => {
  if (!req.body.phone) {
    res.status(422).send("Phone number is required");
    return;
  }

  const phone = String(req.body.phone).replace(/\D/g, "");

  admin
    .auth()
    .createUser({uid: phone})
    .then((user) => res.send(user))
    .catch((error) => {
      res.status(422).send("Error creating user:", error);
    });
};

export default createUserFunction;
