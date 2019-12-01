const functions = require('firebase-functions');
const cors = require("cors")({ origin: true });
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();
const increment = admin.firestore.FieldValue.increment(1);


// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

exports.postSchedule = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        db.collection("Schedule")
            .add(req.body)
            .then(snapshot => {
                return res.status(200).send("Added succefully");
            })
            .catch(e => {
                return res.status(400).send(e)
            })
    });
});

exports.getSchedule = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        let schedule = await db.collection("Schedule").get();
        return res.send(schedule.docs.map(doc => doc.data()));
    });
});

exports.updateParticipants = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        console.log(req.body)
        db.collection("Schedule").where("num", "==", "1574891053239")
            .get()
            .then(snap => {
                snap.update({
                    participants: increment
                })
                return res.status(200).send("Done")
            })
            .catch(e => {
                return e
            })
    });
});