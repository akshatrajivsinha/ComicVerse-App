import admin from "firebase-admin";

const verifyOtpFunction = (req: any, res: any) => {
  if (!req.body.phone || !req.body.code) {
    res.status(422).send({error: "Phone and code must be provided"});
    return;
  }

  const phone = String(req.body.phone).replace(/\D/g, "");
  const code = parseInt(req.body.code);

  admin
    .auth()
    .getUser(phone)
    .then(() => {
      const ref = admin.database().ref("users/" + phone);
      ref.on("value", (snapshot) => {
        const user = snapshot.val();

        if (user.code != code) {
          return res.status(499).send({error: "Code is inValid"});
        }

        admin
          .auth()
          .createCustomToken(phone)
          .then((token) =>
            Promise.all([
              ref.update({authToken: token, registrationCompleted: true}),
              res.status(200).send({success: true}),
            ])
          );
      });
    })
    .catch((err) => {
      res.status(499).send({error: err});
    });
};

export default verifyOtpFunction;
