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

const users = [
  {
    "IdentNumber": 4867,
    "firstName": "Neel",
    "middleName": "Jagesh",
    "lastName": "Patel",
    "email": "neelp2023@gmail.com",
    "dob": "03/04/2005",
    "gender": "Male",
    "mandal": "",
    "center": "Munster",
    "phone": "(219) 315-3692",
    "permissionGroup": "Kishore Co-Sanchalak",
    "primaryWing": "Kishore",
    "group": "K2",
    "emeContactName": "Ami Patel",
    "emeContactPhone": "(219) 315-3692",
    "userRole": "User",
    "adminDisplayName": "Developer"
  },
  {
    "IdentNumber": 3753,
    "firstName": "Parthiv",
    "middleName": "Ashish",
    "lastName": "Patel",
    "email": "parthivpatel46143@gmail.com",
    "dob": "05/28/2004",
    "gender": "Male",
    "mandal": "",
    "center": "Indianapolis",
    "phone": "(317) 965-0114",
    "permissionGroup": "Kishore Campus Sanchalak",
    "primaryWing": "Kishore",
    "group": "K2",
    "emeContactName": "Shivam",
    "emeContactPhone": "(317) 8510785",
    "userRole": "User",
    "adminDisplayName": "Developer"
  },
  {
    "IdentNumber": 3744,
    "firstName": "Pratik",
    "middleName": "Kalpeshkumar",
    "lastName": "Patel",
    "email": "pratik81005@gmail.com",
    "dob": "08/10/2005",
    "gender": "Male",
    "mandal": "",
    "center": "Indianapolis",
    "phone": "(317) 938-8466",
    "permissionGroup": "Kishore RC",
    "primaryWing": "Kishore",
    "group": "K1",
    "emeContactName": "Jigar Patel",
    "emeContactPhone": "(317) 9387945",
    "userRole": "User",
    "adminDisplayName": "Developer"
  }
];

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
      email: user.email,
      dob: user.dob,
      gender: user.gender,
      mandal: user.mandal,
      center: user.center,
      phone: user.phone,
      permissionGroup: user.permissionGroup,
      primaryWing: user.primaryWing,
      group: user.group,
      emeContactName: user.emeContactName,
      emeContactPhone: user.emeContactPhone,
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
  fs.writeFile('passwords.txt', passwordData, (err) => {
    if (err) throw err;
    console.log('Passwords saved in passwords.txt');
  });
})
.catch((error) => {
  console.error('Error in user creation process:', error);
});
