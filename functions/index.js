const { setGlobalOptions } = require("firebase-functions");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

setGlobalOptions({ maxInstances: 10, region: "asia-northeast3" });

admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();

// Firestore에 알림 생성 시 FCM 푸시 발송
exports.sendPushNotification = onDocumentCreated(
  "users/{uid}/notifications/{notifId}",
  async (event) => {
    const notif = event.data?.data();
    if (!notif) return;

    const uid = event.params.uid;

    // 수신자 FCM 토큰 가져오기
    const userDoc = await db.collection("users").doc(uid).get();
    const fcmToken = userDoc.data()?.fcmToken;
    if (!fcmToken) return;

    // 알림 타입별 메시지
    const messages = {
      invite:        { title: "여행 초대", body: `${notif.fromName || "누군가"}님이 여행에 초대했어요.` },
      invite_accept: { title: "초대 수락", body: `${notif.fromName || "누군가"}님이 초대를 수락했어요.` },
      invite_reject: { title: "초대 거절", body: `${notif.fromName || "누군가"}님이 초대를 거절했어요.` },
      companion_add: { title: "동행인 추가", body: `${notif.fromName || "누군가"}님이 여행에 추가했어요.` },
      trip_copy:     { title: "일정 공유", body: `${notif.fromName || "누군가"}님이 일정을 공유했어요.` },
      trip_edit:     { title: "일정 수정", body: `${notif.fromName || "누군가"}님이 일정을 수정했어요.` },
    };

    const msg = messages[notif.type] || { title: "TripLikeJ", body: "새 알림이 있어요." };

    try {
      await messaging.send({
        token: fcmToken,
        notification: { title: msg.title, body: msg.body },
        webpush: {
          notification: {
            title: msg.title,
            body: msg.body,
            icon: "https://arschooling.github.io/TripLikeJ/icon-192.png",
            badge: "https://arschooling.github.io/TripLikeJ/icon-192.png",
          },
          fcmOptions: { link: "https://arschooling.github.io/TripLikeJ/" },
        },
      });
    } catch (e) {
      // 토큰 만료 시 Firestore에서 제거
      if (e.code === "messaging/registration-token-not-registered") {
        await db.collection("users").doc(uid).update({ fcmToken: admin.firestore.FieldValue.delete() });
      }
    }
  }
);
