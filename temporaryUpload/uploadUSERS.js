const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('./mwyogicup-9320c-firebase-adminsdk-szsbo-6ad261188c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore(); // Initialize Firestore database

// Function to generate a random password
function generatePassword(length = 10) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
}

const users = 
[
  {
    "IdentNumber": 4867,
    "firstName": "Neel",
    "middleName": "Jagesh",
    "lastName": "Patel",
    "email": "neelp2023@gmail.com",
    "tShirtSize": "Adult Medium",
    "center": "Munster",
    "group": "K2",
    "team": "Team 3",
    "hotel": "Hampton Inn",
    "room": 209,
    "userRole": "Admin",
    "adminDisplayName": ""
  },
]

let passwordData = '';
let userCreationPromises = [];

users.forEach(user => {
  const userPassword = generatePassword();
  const userCreationPromise = admin.auth().createUser({
    email: user.email,
    emailVerified: false,
    password: userPassword,
    displayName: user.firstName,
    disabled: false
  })
  .then((userRecord) => {
    console.log('Successfully created new user:', userRecord.uid);
    passwordData += `${user.email}: ${userPassword}\n`;

    const userData = {
      uid: userRecord.uid,
      identNumber: user.IdentNumber,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      tShirtSize: user.tShirtSize,
      email: user.email,
      team: user.team,
      center: user.center,
      group: user.group,
      hotel: user.hotel,
      room: user.room,
      userRole: user.userRole,
      adminDisplayName: user.adminDisplayName
    };

    return db.collection('userDATA').doc(userRecord.uid).set(userData);
  })
  .catch((error) => {
    console.log('Error creating new user:', error);
  });

  userCreationPromises.push(userCreationPromise);
});

Promise.all(userCreationPromises).then(() => {
  fs.writeFile('passwords1.txt', passwordData, (err) => {
    if (err) throw err;
    console.log('Passwords saved in passwords.txt');
  });
})
.catch((error) => {
  console.error('Error in user creation process:', error);
});
