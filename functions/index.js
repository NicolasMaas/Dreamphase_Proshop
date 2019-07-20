const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({
    origin: true
});

// admin.initializeApp(functions.config().firebase);
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://nicolas-proshop.firebaseio.com'
})

const database = admin.database();
const db = admin.firestore();

// ! Expand /balls with search by brand, name, type.
// This way I have a clean url

exports.balls = functions.https.onRequest(async (req, res) => {
    if (req.method !== "GET") {
        res.status(400).send('GET Request only');
        return console.error('GET Request only');
    } else {
        try {
            let result;

            // By brand
            if (req.query.brand) {
                let result = [];

                await db.collection('balls').where('brand', '==', req.query.brand).get().then(snapshot => {
                    snapshot.forEach(doc => {
                        result.push(doc.data());
                    });

                    return snapshot;
                });

                if (result) {
                    return res.status(200).send(result);
                } else {
                    return res.status(404).send('Brand not found, try again');
                }
            }

            // By name
            else if (req.query.name) {
                await db.collection('balls').where('name', '==', req.query.name).get().then(snapshot => {
                    snapshot.forEach(doc => {
                        result = doc.data();
                    });

                    return snapshot;
                });

                if (result) {
                    return res.status(200).send(result);
                } else {
                    return res.status(404).send('Ball not found, try again');
                }
            }

            // By type
            else if (req.query.type) {
                let result = [];

                await db.collection('balls').where('type', '==', req.query.type).get().then(snapshot => {
                    snapshot.forEach(doc => {
                        result.push(doc.data());
                    });

                    return snapshot;
                });

                if (result) {
                    return res.status(200).send(result);
                } else {
                    return res.status(404).send('Type not found, only solid, pearl or hybrid exists');
                }
            }

            // All
            else {
                let result = [];

                await db.collection('balls').get().then(snapshot => {
                    snapshot.forEach(doc => {
                        result.push(doc.data());
                    });

                    return snapshot;
                });

                if (result) {
                    return res.status(200).send(result);
                } else {
                    return res.status(404).send('Nothing found');
                }
            }
        } catch (e) {
            console.error(e);
            res.status(500).send(`Something went wrong...`);
        }
    }

    return console.log('Done');
});

// Sending an email
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'nicolasmaas20@gmail.com',
        pass: 'vvoigrkyvijnbarl'
    }
});

exports.sendMail = functions.https.onRequest((req, res) => {

    res.set('Access-Control-Allow-Origin', 'http://localhost:4000');

    if (req.method === "OPTIONS") {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    }

    if (req.method !== "POST") {
        res.status(400).send('POST Request only');
        return console.error('POST Request only');
    } else {
        try {
            const receiver = req.body.receiver;

            let name = req.body.name,
                mail = req.body.mail,
                msg = req.body.msg,
                subject = (req.body.subject) ? req.body.subject : name + ' wilt je iets vragen via je website!';

            console.log(name);
            console.log(mail);
            console.log(receiver);
            console.log(subject);
            console.log(msg);

            const mailOptions = {
                from: name + '<' + mail + '>',
                to: receiver,
                subject: subject,
                html: msg
            };

            return transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send('Something went wrong...');
                } else {
                    console.log(info);
                    return res.status(200).send('Ok');
                }
            });
        } catch (e) {
            console.error(e);
            return res.status(500).send('Something went wrong...');
        }
    }
});