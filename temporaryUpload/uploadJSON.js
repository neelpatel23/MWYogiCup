const admin = require('firebase-admin');
const serviceAccount = require('./mwyogicup-9320c-firebase-adminsdk-szsbo-6ad261188c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore(); // Initialize Firestore database

const data = {
  "contact": [
    {
      "id": 1,
      "name": "John Doe",
      "phone": "123-456-7890",
      "email": "johndoe@example.com",
      "image": "https://example.com/johndoe.jpg"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "phone": "987-654-3210",
      "email": "janesmith@example.com",
      "image": "https://randomuser.me/api/portraits/men/30.jpg"
    }
  ]
};

const uploadInformationToFirestore = (data) => {
    data.forEach((info, index) => {
      const dataRef = db.collection('contactDATA').doc(`Contact ${index + 1}`);
      dataRef.set(info)
        .then(() => {
          console.log(`Contact ${index + 1} uploaded successfully.`);
        })
        .catch((error) => {
          console.error(`Error uploading Contact ${index + 1}:`, error);
        });
    });
  };
  
  // Upload the information data
  uploadInformationToFirestore(data.contact);