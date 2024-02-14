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
    "IdentNumber": 2210,
    "firstName": "Moksh",
    "middleName": "Rajeev",
    "lastName": "Desai",
    "email": "desaimoksh15@gmail.com",
    "tShirtSize": "Adult medium",
    "center": "Columbus",
    "group": "K2",
    "team": "Team 1",
    "hotel": "Hampton Inn",
    "room": 201,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 2199,
    "firstName": "Aadarsh",
    "middleName": "Hitesh",
    "lastName": "Patel",
    "email": "aadarshpatel05@outlook.com",
    "tShirtSize": "Adult medium",
    "center": "Columbus",
    "group": "K1",
    "team": "Team 2",
    "hotel": "Hampton Inn",
    "room": 202,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 4867,
    "firstName": "Neel",
    "middleName": "Jagesh",
    "lastName": "Patel",
    "email": "neelp2023@gmail.com",
    "tShirtSize": "Adult medium",
    "center": "Munster",
    "group": "K2",
    "team": "Team 3",
    "hotel": "Hampton Inn",
    "room": 203,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 10465,
    "firstName": "Vraj",
    "middleName": "Nilesh",
    "lastName": "Patel",
    "email": "vraj8701@gmail.com",
    "tShirtSize": "Adult medium",
    "center": "Chicago South",
    "group": "Yuvak",
    "team": "Team 4",
    "hotel": "Hampton Inn",
    "room": 204,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 4816,
    "firstName": "Manit",
    "middleName": "Gopal",
    "lastName": "Patel",
    "email": "manitpatel21@gmail.com",
    "tShirtSize": "Adult medium",
    "center": "Minneapolis",
    "group": "K2",
    "team": "Team 5",
    "hotel": "Hampton Inn",
    "room": 205,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 10138,
    "firstName": "Aditya",
    "middleName": "Nilkanth",
    "lastName": "Patel",
    "email": "adirocks3899@gmail.com",
    "tShirtSize": "Adult xl",
    "center": "Chicago South",
    "group": "Yuvak",
    "team": "Team 2",
    "hotel": "Hampton Inn",
    "room": 207,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 1766,
    "firstName": "Akshat",
    "middleName": "Virendra",
    "lastName": "Patel",
    "email": "akshatp12@gmail.com",
    "tShirtSize": "Adult medium",
    "center": "Chicago North",
    "group": "Yuvak",
    "team": "Team 3",
    "hotel": "Hampton Inn",
    "room": 208,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 3075,
    "firstName": "Himanshu",
    "middleName": "Yagnesh",
    "lastName": "Patel",
    "email": "yagnesh838@yahoo.com",
    "tShirtSize": "Adult medium",
    "center": "Evansville",
    "group": "K2",
    "team": "Team 4",
    "hotel": "Hampton Inn",
    "room": 209,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 2244,
    "firstName": "Kishan",
    "middleName": "Umeshbhai",
    "lastName": "Patel",
    "email": "kishanpatel_11896@yahoo.com",
    "tShirtSize": "Adult medium",
    "center": "Columbus",
    "group": "Yuvak",
    "team": "Team 5",
    "hotel": "Hampton Inn",
    "room": 210,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 10106,
    "firstName": "Jigar",
    "middleName": "Kalpesh",
    "lastName": "Patel",
    "email": "jigu210@gmail.com",
    "tShirtSize": "Adult medium",
    "center": "Indianapolis",
    "group": "Yuvak",
    "team": "Team 1",
    "hotel": "Hampton Inn",
    "room": 211,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 1982,
    "firstName": "Kirtan",
    "middleName": "Mukesh",
    "lastName": "Patel",
    "email": "kirtanp101@gmail.com",
    "tShirtSize": "Adult medium",
    "center": "Cleveland",
    "group": "K2",
    "team": "Team 2",
    "hotel": "Hampton Inn",
    "room": 212,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 3744,
    "firstName": "Pratik",
    "middleName": "Kalpeshkumar",
    "lastName": "Patel",
    "email": "pratik81005@gmail.com",
    "tShirtSize": "Adult small",
    "center": "",
    "group": "K1",
    "team": "Team 3",
    "hotel": "Hampton Inn",
    "room": 213,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 1995,
    "firstName": "Rohan",
    "middleName": "Ajay",
    "lastName": "Patel",
    "email": "rp.rohan1208@gmail.com",
    "tShirtSize": "Adult medium",
    "center": "Cleveland",
    "group": "Yuvak",
    "team": "Team 1",
    "hotel": "Hampton Inn",
    "room": 216,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 6710,
    "firstName": "Rushi",
    "middleName": "J",
    "lastName": "Patel",
    "email": "rushipatel314@gmail.com",
    "tShirtSize": "Adult medium",
    "center": "St. Louis",
    "group": "Sanyukta",
    "team": "Team 2",
    "hotel": "Hampton Inn",
    "room": 217,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 3753,
    "firstName": "Parthiv",
    "middleName": "Ashish",
    "lastName": "Patel",
    "email": "parthivpatel46143@gmail.com",
    "tShirtSize": "Adult medium",
    "center": "Indianapolis",
    "group": "K2",
    "team": "Team 3",
    "hotel": "Hampton Inn",
    "room": 218,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 1001,
    "firstName": "Sample",
    "middleName": "User",
    "lastName": "One",
    "email": "sample.user1@email.com",
    "tShirtSize": "Adult medium",
    "center": "Chicago North",
    "group": "K2",
    "team": "Team 7",
    "hotel": "Hampton Inn",
    "room": 219,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 1002,
    "firstName": "Sample",
    "middleName": "User",
    "lastName": "Two",
    "email": "sample.user2@email.com",
    "tShirtSize": "Adult medium",
    "center": "Evansville",
    "group": "K1",
    "team": "Team 8",
    "hotel": "Hampton Inn",
    "room": 220,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 1003,
    "firstName": "Sample",
    "middleName": "User",
    "lastName": "Three",
    "email": "sample.user3@email.com",
    "tShirtSize": "Adult small",
    "center": "Columbus",
    "group": "Yuvak",
    "team": "Team 9",
    "hotel": "Hampton Inn",
    "room": 221,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 1004,
    "firstName": "Sample",
    "middleName": "User",
    "lastName": "Four",
    "email": "sample.user4@email.com",
    "tShirtSize": "Adult xl",
    "center": "Indianapolis",
    "group": "K1",
    "team": "Team 10",
    "hotel": "Hampton Inn",
    "room": 222,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 1005,
    "firstName": "Sample",
    "middleName": "User",
    "lastName": "Five",
    "email": "sample.user5@email.com",
    "tShirtSize": "Adult medium",
    "center": "Cleveland",
    "group": "Yuvak",
    "team": "Team 11",
    "hotel": "Hampton Inn",
    "room": 223,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 1006,
    "firstName": "Sample",
    "middleName": "User",
    "lastName": "Six",
    "email": "sample.user6@email.com",
    "tShirtSize": "Adult medium",
    "center": "Indianapolis",
    "group": "K2",
    "team": "Team 12",
    "hotel": "Hampton Inn",
    "room": 224,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 1007,
    "firstName": "Sample",
    "middleName": "User",
    "lastName": "Seven",
    "email": "sample.user7@email.com",
    "tShirtSize": "Adult medium",
    "center": "Chicago South",
    "group": "K1",
    "team": "Team 13",
    "hotel": "Hampton Inn",
    "room": 225,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 1008,
    "firstName": "Sample",
    "middleName": "User",
    "lastName": "Eight",
    "email": "sample.user8@email.com",
    "tShirtSize": "Adult medium",
    "center": "Columbus",
    "group": "Yuvak",
    "team": "Team 14",
    "hotel": "Hampton Inn",
    "room": 226,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 1009,
    "firstName": "Sample",
    "middleName": "User",
    "lastName": "Nine",
    "email": "sample.user9@email.com",
    "tShirtSize": "Adult medium",
    "center": "Cleveland",
    "group": "K2",
    "team": "Team 15",
    "hotel": "Hampton Inn",
    "room": 227,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 1010,
    "firstName": "Sample",
    "middleName": "User",
    "lastName": "Ten",
    "email": "sample.user0@email.com",
    "tShirtSize": "Adult small",
    "center": "St. Louis",
    "group": "Yuvak",
    "team": "Team 16",
    "hotel": "Hampton Inn",
    "room": 228,
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 101,
    "firstName": "Nirmalprem",
    "middleName": "",
    "lastName": "Swami",
    "email": "bk.mw03@usa.baps.org",
    "tShirtSize": "",
    "center": "Midwest",
    "group": "Sant",
    "team": "",
    "hotel": "",
    "room": "",
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 102,
    "firstName": "Uttamshlok",
    "middleName": "",
    "lastName": "Swami",
    "email": "bk.mw02@usa.baps.org",
    "tShirtSize": "",
    "center": "Midwest",
    "group": "Sant",
    "team": "",
    "hotel": "",
    "room": "",
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 103,
    "firstName": "Vatsalmurti",
    "middleName": "",
    "lastName": "Swami",
    "email": "vm1301@edu.na.baps.org",
    "tShirtSize": "",
    "center": "Midwest",
    "group": "Sant",
    "team": "",
    "hotel": "",
    "room": "",
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 104,
    "firstName": "Purnamangal",
    "middleName": "",
    "lastName": "Swami",
    "email": "pm1701@edu.na.baps.org",
    "tShirtSize": "",
    "center": "Midwest",
    "group": "Sant",
    "team": "",
    "hotel": "",
    "room": "",
    "userRole": "",
    "adminDisplayName": ""
  },
  {
    "IdentNumber": 105,
    "firstName": "Siddhayogi",
    "middleName": "",
    "lastName": "Swami",
    "email": "bk.mw04@usa.baps.org",
    "tShirtSize": "",
    "center": "Midwest",
    "group": "Sant",
    "team": "",
    "hotel": "",
    "room": "",
    "userRole": "",
    "adminDisplayName": ""
  }
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
  fs.writeFile('passwords.txt', passwordData, (err) => {
    if (err) throw err;
    console.log('Passwords saved in passwords.txt');
  });
})
.catch((error) => {
  console.error('Error in user creation process:', error);
});
