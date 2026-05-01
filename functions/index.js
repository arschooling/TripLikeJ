const { setGlobalOptions } = require('firebase-functions');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');

setGlobalOptions({ maxInstances: 10 });

admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();

exports.sendPushNotification = onDocumentCreated(
  'users/{uid}/notifications/{notifId}',
  async (event) => {
    const notif = event.data?.data();
    if (!notif) return;

    const uid = event.params.uid;

    const userDoc = await db.collection('users').doc(uid).get();
    const fcmToken = userDoc.data()?.fcmToken;
    if (!fcmToken) return;

    const name = notif.fromName || '누군가';
    const trip = notif.tripTitle ? `"${notif.tripTitle}"` : '여행';
    const messages = {
      invite_received:    { title: '여행 초대',   body: `${name}님이 ${trip}에 초대했어요.` },
      invite_accepted:    { title: '초대 수락',   body: `${name}님이 ${trip} 초대를 수락했어요.` },
      invite_rejected:    { title: '초대 거절',   body: `${name}님이 ${trip} 초대를 거절했어요.` },
      trip_member_added:  { title: '여행 참여',   body: `${name}님이 ${trip}에 회원님을 추가했어요.` },
      contact_added:      { title: '동행인 요청', body: `${name}님이 동행인 요청을 보냈어요.` },
      contact_accepted:   { title: '동행인 수락', body: `${name}님이 동행인 요청을 수락했어요.` },
      trip_copy_received: { title: '일정 공유',   body: `${name}님이 ${trip} 일정을 보냈어요.` },
      trip_copy_accepted: { title: '일정 수락',   body: `${name}님이 ${trip} 일정을 받았어요.` },
      trip_edited:        { title: '일정 수정',   body: `${name}님이 ${trip} 일정을 수정했어요.` },
    };

    const msg = messages[notif.type] || { title: 'TripLikeJ', body: '새 알림이 있어요.' };

    try {
      await messaging.send({
        token: fcmToken,
        notification: { title: msg.title, body: msg.body },
        webpush: {
          notification: {
            title: msg.title,
            body: msg.body,
            icon: 'https://arschooling.github.io/TripLikeJ/icon-192.png',
            badge: 'https://arschooling.github.io/TripLikeJ/icon-192.png',
          },
          fcmOptions: { link: 'https://arschooling.github.io/TripLikeJ/' },
        },
      });
    } catch (e) {
      if (e.code === 'messaging/registration-token-not-registered') {
        await db.collection('users').doc(uid).update({
          fcmToken: admin.firestore.FieldValue.delete(),
        });
      }
    }
  }
);
