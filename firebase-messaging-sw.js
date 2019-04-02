importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// // Initialize Firebase
// var configpush = {
//     apiKey: "AIzaSyAtVsLawVSjNFcIFaZGDcN0ccf_769WhzM",
//     authDomain: "expressproject-3953c.firebaseapp.com",
//     databaseURL: "https://expressproject-3953c.firebaseio.com",
//     projectId: "expressproject-3953c",
//     storageBucket: "expressproject-3953c.appspot.com",
//     messagingSenderId: "341946518193"
// };

// firebase.initializeApp(configpush);
// const messaging = firebase.messaging();

// messaging.setBackgroundMessageHandler(function(payload){
//     const title = 'hello world';
//     const options = {
//         body: payload.data.status
//     };
//     return self.registration.showNotification(title, options);
// });
firebase.initializeApp({
    messagingSenderId: "your messagingSenderId again"
});
const messaging = firebase.messaging();