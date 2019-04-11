importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

var FireConfig = {
    apiKey: "AIzaSyDWEofeVuRxaZk_732VHAMDY5P9r5BqkJc",
    authDomain: "jobapi-ae2a1.firebaseapp.com",
    databaseURL: "https://jobapi-ae2a1.firebaseio.com",
    projectId: "jobapi-ae2a1",
    storageBucket: "jobapi-ae2a1.appspot.com",
    messagingSenderId: "587389137332"
};
firebase.initializeApp(FireConfig);

var messaging = firebase.messaging();
messaging.requestPermission()
    .then(function () {
        console.log('have permission');
    })
    .catch(function (err) {
        console.log('Error Occured');
    })