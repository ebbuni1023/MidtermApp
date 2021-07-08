import * as firebase from 'firebase';
import 'firebase/firestore';
import config from '../../firebase.json';

let app = null;
if (!firebase.apps.length) {
  app = firebase.initializeApp(config);
} else {
  app = firebase.app();
}

const Auth = app.auth();

export const login = async ({ email, password }) => {
  const { user } = await Auth.signInWithEmailAndPassword(email, password);
  return user;
};

const uploadImage = async (uri, user) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  // const user = Auth.currentUser;
  const ref = app.storage().ref(`/profile/${user.uid}/photo.png`);
  const snapshot = await ref.put(blob, { contentType: 'image/png' });

  blob.close();
  return await snapshot.ref.getDownloadURL();
};

export const signup = async ({ email, uid, name, photoUrl }) => {
  // const { user } = await Auth.createUserWithEmailAndPassword(email, password);
  const user = {email, uid, name, photoUrl};
  const storageUrl = photoUrl.startsWith('https')
    ? photoUrl
    : await uploadImage(photoUrl, user);
  // await user.updateProfile({
  //   displayName: name,
  //   photoURL: storageUrl,
  // });
  user.photoUrl = storageUrl;
  return user;
};

export const logout = async () => {
  return await Auth.signOut();
};

export const getCurrentUser = () => {
  const { uid, displayName, email, photoUrl } = Auth.currentUser;
  return { uid, name: displayName, email, photoUrl: photoUrl };
};

export const updateUserPhoto = async (photoUrl, user) => {
  // const user = Auth.currentUser;

  const storageUrl = photoUrl.startsWith('https')
    ? photoUrl
    : await uploadImage(photoUrl, user);

  // await user.updateProfile({ photoURL: storageUrl });
  // console.log(storageUrl);

  user.photoUrl = storageUrl;
  return { name: user.name, uid: user.uid, email: user.email, photoUrl: user.photoUrl };
};

export const DB = firebase.firestore();

export const createChannel = async ({ title, description }) => {
  const newChannelRef = DB.collection('channels').doc();
  const id = newChannelRef.id;
  const newChannel = {
    id,
    title,
    description,
    createdAt: Date.now(),
  };
  await newChannelRef.set(newChannel);
  return id;
};

export const createMessage = async ({ channelId, message }) => {
  return await DB.collection('channels')
    .doc(channelId)
    .collection('messages')
    .doc(message._id)
    .set({
      ...message,
      createdAt: Date.now(),
    });
};
