const admin = require('firebase-admin');
const serviceAccount = require('./mwyogicup-9320c-firebase-adminsdk-szsbo-6ad261188c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore(); // Initialize Firestore database

const regularSeasonData = {
  K1: [
    { team1: 'Team A', team2: 'Team B', date: '2022-03-01', time: '18:00' },
    { team1: 'Team C', team2: 'Team D', date: '2022-03-05', time: '19:30' },
    // Add more games as needed
  ],
  K2: [
    { team1: 'Team X', team2: 'Team Y', date: '2022-03-02', time: '17:45' },
    { team1: 'Team P', team2: 'Team Q', date: '2022-03-08', time: '20:15' },
    // Add more games as needed
  ],
  YM: [
    { team1: 'Team M', team2: 'Team N', date: '2022-03-03', time: '16:30' },
    { team1: 'Team Z', team2: 'Team T', date: '2022-03-07', time: '18:45' },
    // Add more games as needed
  ],
};

const uploadRegularSeasonDataToFirestore = () => {
  Object.entries(regularSeasonData).forEach(([ageGroup, games]) => {
    const ageGroupRef = db.collection('regularSeasonDATA').doc(ageGroup);
    const data = { games };

    ageGroupRef.set(data)
      .then(() => {
        console.log(`${ageGroup} schedules uploaded successfully.`);
      })
      .catch((error) => {
        console.error(`Error uploading ${ageGroup} schedules:`, error);
      });
  });
};

// Upload the regular season data
uploadRegularSeasonDataToFirestore();

