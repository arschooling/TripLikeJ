// ─── Lazy Firebase Loader ────────────────────────────────────
// Firebase SDK는 필요할 때 처음 로드됨 (첫 화면 즉시 표시)
const firebaseConfig = {
  apiKey: "AIzaSyBwWcPIioHZDMoNzd_9UJiwmhwKT1TTYTM",
  authDomain: "triplikej.firebaseapp.com",
  projectId: "triplikej",
  storageBucket: "triplikej.firebasestorage.app",
  messagingSenderId: "1045914771780",
  appId: "1:1045914771780:web:7adef948e46137073e7711",
};

// SDK가 firebase-sdk.min.js로 이미 로드됨 — 바로 초기화
firebase.initializeApp(firebaseConfig);
const _fbAuth = firebase.auth();
const _fbDb   = firebase.firestore();
_fbAuth.getRedirectResult().catch(e => console.warn('redirect:', e.code));

function _load() { return Promise.resolve(); }

// ─── Auth ────────────────────────────────────────────────────
const _googleProvider = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return provider;
};
window.fbSignIn         = async () => { await _load(); return _fbAuth.signInWithPopup(_googleProvider()); };
window.fbSignInRedirect = async () => { await _load(); return _fbAuth.signInWithRedirect(_googleProvider()); };
window.fbSignOut        = async () => { await _load(); return _fbAuth.signOut(); };
window.fbOnAuth         = (cb)      => { _load().then(() => _fbAuth.onAuthStateChanged(cb)); };

// ─── User document ───────────────────────────────────────────
window.fbGetOrCreateUser = async (fbUser) => {
  await _load();
  const ref  = _fbDb.collection('users').doc(fbUser.uid);
  const snap = await ref.get({ source: 'server' }).catch(() => ref.get());
  if (!snap.exists) {
    const data = {
      displayName : fbUser.displayName || '여행자',
      email       : fbUser.email       || '',
      photoURL    : fbUser.photoURL    || '',
      groupId     : fbUser.uid,
      tripIds     : [fbUser.uid],
      createdAt   : firebase.firestore.FieldValue.serverTimestamp(),
    };
    await ref.set(data);
    // 신규 유저는 빈 여행으로 시작 (뉴욕 기본값 X)
    await _fbDb.collection('groups').doc(fbUser.uid).set({
      title   : '내 여행',
      dates   : '',
      hotel   : '',
      days    : [],
      hotels  : [],
      food    : [],
      members : [fbUser.uid],
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    await _fbDb.collection('preps').doc(fbUser.uid).set({
      prep: { checklist:[], docs:[], pack:[] },
    });
    return { ...data, uid: fbUser.uid };
  }
  const existing = snap.data();

  // groups/{uid} 문서가 없으면 생성 (데이터가 사라진 경우 복구)
  const groupRef  = _fbDb.collection('groups').doc(fbUser.uid);
  const groupSnap = await groupRef.get();
  const def = JSON.parse(JSON.stringify(window.TRIP_DEFAULT));
  const tripDefault = {
    title   : def.title  || 'New York',
    dates   : def.dates  || '',
    hotel   : def.hotel  || '',
    days    : def.days   || [],
    hotels  : def.hotels || [],
    food    : def.food   || [],
  };
  if (!groupSnap.exists) {
    console.warn('[TripLikeJ] groups/' + fbUser.uid + ' 없음 → 새로 생성');
    await groupRef.set({ ...tripDefault, members: [fbUser.uid], createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  } else if (!(groupSnap.data().days || []).length) {
    console.warn('[TripLikeJ] groups/' + fbUser.uid + ' days 비어있음 → TRIP_DEFAULT로 복구');
    await groupRef.set(tripDefault, { merge: true });
  }

  // tripIds 정리: 실제 멤버로 남아있는 여행만 유지
  let tripIds = existing.tripIds || [fbUser.uid];
  if (!tripIds.includes(fbUser.uid)) tripIds = [fbUser.uid, ...tripIds];
  const groupSnaps = await Promise.all(tripIds.map(id => _fbDb.collection('groups').doc(id).get()));
  const validTripIds = tripIds.filter((id, i) =>
    groupSnaps[i].exists && (groupSnaps[i].data().members || []).includes(fbUser.uid)
  );
  if (JSON.stringify(validTripIds) !== JSON.stringify(existing.tripIds || [])) {
    await ref.update({ tripIds: validTripIds });
  }
  return { uid: fbUser.uid, ...existing, tripIds: validTripIds };
};

// ─── Shared group ─────────────────────────────────────────────
window.fbListenGroup = (groupId, cb) =>
  _fbDb.collection('groups').doc(groupId)
    .onSnapshot(
      s => cb(s.exists ? s.data() : null),
      err => { console.warn('fbListenGroup error:', err.code); cb(null); }
    );

// ─── 디버그용: native Promise로 감싸서 10초 타임아웃 보장 ──────
window.fbDebugRead = function(groupId) {
  return new Promise(function(resolve) {
    // 10초 후 무조건 resolve
    var t = setTimeout(function() {
      resolve({ ok: false, reason: 'TIMEOUT — Firestore 무응답 (10s)', userCheck: '?' });
    }, 10000);

    // groups 읽기
    _fbDb.collection('groups').doc(groupId).get().then(
      function(snap) {
        clearTimeout(t);
        // users도 같이 읽기
        _fbDb.collection('users').doc(groupId).get().then(
          function(us) {
            resolve({
              ok: snap.exists,
              reason: snap.exists ? '' : 'groups: no document',
              title: snap.exists ? (snap.data().title || '(없음)') : '',
              days:  snap.exists ? (snap.data().days||[]).length : 0,
              userCheck: 'users:' + (us.exists ? 'OK' : 'noDoc'),
            });
          },
          function(ue) { resolve({ ok: snap.exists, reason: snap.exists ? '' : 'groups:noDoc', title: '', days: 0, userCheck: 'users:ERR:' + ue.code }); }
        );
      },
      function(e) {
        clearTimeout(t);
        resolve({ ok: false, reason: 'groups:ERR:' + (e.code||'?') + ':' + (e.message||''), userCheck: '?' });
      }
    );
  });
};

window.fbSaveGroup = (groupId, patch) =>
  _fbDb.collection('groups').doc(groupId).set(patch, { merge: true });

// ─── Private prep ─────────────────────────────────────────────
window.fbListenPrep = (uid, cb) =>
  _fbDb.collection('preps').doc(uid)
    .onSnapshot(s => cb(s.exists ? (s.data().prep || {}) : {}));

window.fbSavePrep = (uid, prep) =>
  _fbDb.collection('preps').doc(uid).set({ prep }, { merge: true });

// ─── User lookup ──────────────────────────────────────────────
window.fbSearchUser = async (email) => {
  const snap = await _fbDb.collection('users').where('email','==',email.trim()).get();
  if (snap.empty) return null;
  return { uid: snap.docs[0].id, ...snap.docs[0].data() };
};

// ─── Invites ──────────────────────────────────────────────────
window.fbSendInvite = async (fromUser, toEmail) => {
  const toUser = await fbSearchUser(toEmail);
  if (!toUser)                     return { error: '가입된 사용자가 없습니다.' };
  if (toUser.uid === fromUser.uid) return { error: '자기 자신에게는 초대할 수 없습니다.' };
  const ex = await _fbDb.collection('invites')
    .where('fromUid','==',fromUser.uid).where('toUid','==',toUser.uid)
    .where('status','==','pending').get();
  if (!ex.empty) return { error: '이미 초대를 보냈습니다.' };
  await _fbDb.collection('invites').add({
    fromUid  : fromUser.uid, fromName : fromUser.displayName,
    fromEmail: fromUser.email, fromPhoto: fromUser.photoURL || '',
    toUid    : toUser.uid, groupId  : fromUser.groupId,
    status   : 'pending',
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  return { success: true, toName: toUser.displayName };
};

window.fbListenInvites = (uid, cb) =>
  _fbDb.collection('invites')
    .where('toUid','==',uid).where('status','==','pending')
    .onSnapshot(s => cb(s.docs.map(d => ({ id: d.id, ...d.data() }))));

window.fbListenSentInvites = (uid, cb) =>
  _fbDb.collection('invites')
    .where('fromUid','==',uid).where('status','==','pending')
    .onSnapshot(s => cb(s.docs.map(d => ({ id: d.id, ...d.data() }))));

window.fbCancelInvite = (inviteId) =>
  _fbDb.collection('invites').doc(inviteId).delete();

window.fbAcceptInvite = async (invite, myUid) => {
  await _fbDb.collection('invites').doc(invite.id).update({ status:'accepted' });
  await _fbDb.collection('users').doc(myUid).update({ groupId: invite.groupId });
  await _fbDb.collection('groups').doc(invite.groupId).update({
    members: firebase.firestore.FieldValue.arrayUnion(myUid),
  });
  return invite.groupId;
};

window.fbRejectInvite = (id) =>
  _fbDb.collection('invites').doc(id).update({ status:'rejected' });

window.fbGetCompanions = async (groupId, myUid) => {
  const snap = await _fbDb.collection('groups').doc(groupId).get();
  if (!snap.exists) return [];
  const uids = (snap.data().members || []).filter(u => u !== myUid);
  const res  = await Promise.all(uids.map(async uid => {
    const s = await _fbDb.collection('users').doc(uid).get();
    return s.exists ? { uid, ...s.data() } : null;
  }));
  return res.filter(Boolean);
};

window.fbLeaveGroup = async (userData) => {
  const { uid, groupId } = userData;
  if (groupId === uid) return;
  await _fbDb.collection('groups').doc(groupId).update({
    members: firebase.firestore.FieldValue.arrayRemove(uid),
  });
  const gs = await _fbDb.collection('groups').doc(groupId).get();
  await _fbDb.collection('groups').doc(uid).set(
    gs.exists ? { ...gs.data(), members:[uid] } : { members:[uid] }
  );
  await _fbDb.collection('users').doc(uid).update({ groupId: uid });
};

window.fbUpdateUserGroupId = (uid, groupId) =>
  _fbDb.collection('users').doc(uid).update({ groupId });

// ─── Multiple Trips ───────────────────────────────────────────
window.fbLoadTrips = async (tripIds) => {
  if (!tripIds || !tripIds.length) return [];
  const snaps = await Promise.all(
    tripIds.map(id => _fbDb.collection('groups').doc(id).get())
  );
  return snaps.filter(s => s.exists).map(s => ({ id: s.id, ...s.data() }));
};

window.fbCreateNewTrip = async (uid, title) => {
  const ref = _fbDb.collection('groups').doc();
  const tripId = ref.id;
  const hue = Math.floor(Math.random() * 360);
  await ref.set({
    title, dates: '', hotel: '', days: [], hotels: [], food: [],
    members: [uid], hue,
    permissions: { [uid]: 'owner' },
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  await _fbDb.collection('users').doc(uid).update({
    tripIds: firebase.firestore.FieldValue.arrayUnion(tripId),
  });
  return { tripId, hue };
};

// ─── Trip-specific invites ────────────────────────────────────
window.fbSendTripInvite = async (fromUser, toEmail, tripId, tripTitle) => {
  const toUser = await fbSearchUser(toEmail);
  if (!toUser)                     return { error: '가입된 사용자가 없습니다.' };
  if (toUser.uid === fromUser.uid) return { error: '자기 자신에게는 초대할 수 없습니다.' };
  const tripSnap = await _fbDb.collection('groups').doc(tripId).get();
  if (tripSnap.exists && (tripSnap.data().members || []).includes(toUser.uid))
    return { error: '이미 이 여행에 참여 중입니다.' };
  const ex = await _fbDb.collection('invites')
    .where('fromUid','==',fromUser.uid).where('toUid','==',toUser.uid)
    .where('tripId','==',tripId).where('status','==','pending').get();
  if (!ex.empty) return { error: '이미 초대를 보냈습니다.' };
  await _fbDb.collection('invites').add({
    fromUid  : fromUser.uid, fromName : fromUser.displayName,
    fromEmail: fromUser.email, fromPhoto: fromUser.photoURL || '',
    toUid    : toUser.uid,
    tripId, tripTitle: tripTitle || '',
    groupId  : tripId,
    status   : 'pending',
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  _fbAddNotification(toUser.uid, {
    type: 'invite_received',
    fromUid: fromUser.uid, fromName: fromUser.displayName || '', fromPhoto: fromUser.photoURL || '',
    tripId, tripTitle: tripTitle || '',
  }).catch(() => {});
  return { success: true, toName: toUser.displayName };
};

window.fbAcceptTripInvite = async (invite, myUid) => {
  const tripId = invite.tripId || invite.groupId;
  await _fbDb.collection('invites').doc(invite.id).update({ status: 'accepted' });
  await _fbDb.collection('groups').doc(tripId).update({
    members: firebase.firestore.FieldValue.arrayUnion(myUid),
    [`permissions.${myUid}`]: invite.role || 'edit',
  });
  await _fbDb.collection('users').doc(myUid).update({
    tripIds: firebase.firestore.FieldValue.arrayUnion(tripId),
  });
  const mySnap = await _fbDb.collection('users').doc(myUid).get();
  const myData = mySnap.exists ? mySnap.data() : {};
  _fbAddNotification(invite.fromUid, {
    type: 'invite_accepted',
    fromUid: myUid, fromName: myData.displayName || '', fromPhoto: myData.photoURL || '',
    tripId, tripTitle: invite.tripTitle || '',
  }).catch(() => {});
  return tripId;
};

window.fbSetTripPermission = async (tripId, uid, role) => {
  await _fbDb.collection('groups').doc(tripId).update({
    [`permissions.${uid}`]: role,
  });
};

window.fbGetTripCompanions = async (tripId, myUid) => {
  const snap = await _fbDb.collection('groups').doc(tripId).get();
  if (!snap.exists) return [];
  const uids = (snap.data().members || []).filter(u => u !== myUid);
  const res = await Promise.all(uids.map(async uid => {
    const s = await _fbDb.collection('users').doc(uid).get();
    return s.exists ? { uid, ...s.data() } : null;
  }));
  return res.filter(Boolean);
};

window.fbDeleteTrip = async (tripId, uid) => {
  const snap = await _fbDb.collection('groups').doc(tripId).get();
  const members = snap.exists ? (snap.data().members || []) : [];
  if (members.length <= 1) {
    await _fbDb.collection('groups').doc(tripId).delete();
  } else {
    await _fbDb.collection('groups').doc(tripId).update({
      members: firebase.firestore.FieldValue.arrayRemove(uid),
    });
  }
  await _fbDb.collection('users').doc(uid).update({
    tripIds: firebase.firestore.FieldValue.arrayRemove(tripId),
  });
};

window.fbGetUsersById = async (uids) => {
  if (!uids || !uids.length) return [];
  const snaps = await Promise.all(uids.map(uid => _fbDb.collection('users').doc(uid).get()));
  return snaps.filter(s => s.exists).map(s => ({ uid: s.id, ...s.data() }));
};

window.fbRemoveTripMember = async (tripId, uid) => {
  await _fbDb.collection('groups').doc(tripId).update({
    members: firebase.firestore.FieldValue.arrayRemove(uid),
  });
  // users/{uid} 는 상대방 문서라 권한이 없을 수 있어 별도 처리
  // 제거된 사용자의 tripIds는 로그인 시 fbGetOrCreateUser에서 정리됨
};

// ─── Gmail OAuth token ────────────────────────────────────────
// gmail.readonly 스코프를 추가로 요청해 액세스 토큰을 반환
window.fbGetGmailToken = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
  const result = await _fbAuth.signInWithPopup(provider);
  return result.credential.accessToken;
};

// ─── Global contacts ──────────────────────────────────────────
window.fbAddContact = async (myUid, contactEmail) => {
  const toUser = await fbSearchUser(contactEmail);
  if (!toUser) return { error: '가입된 사용자가 없습니다.' };
  if (toUser.uid === myUid) return { error: '자기 자신은 추가할 수 없습니다.' };
  await _fbDb.collection('users').doc(myUid).update({
    contacts: firebase.firestore.FieldValue.arrayUnion(toUser.uid),
  });
  await _fbDb.collection('users').doc(toUser.uid).update({
    contacts: firebase.firestore.FieldValue.arrayUnion(myUid),
  }).catch(() => {});
  return { success: true, toName: toUser.displayName };
};

window.fbGetContacts = async (uid) => {
  const snap = await _fbDb.collection('users').doc(uid).get();
  const ids = snap.data()?.contacts || [];
  if (!ids.length) return [];
  return window.fbGetUsersById(ids);
};

window.fbRemoveContact = async (myUid, contactUid) => {
  await _fbDb.collection('users').doc(myUid).update({
    contacts: firebase.firestore.FieldValue.arrayRemove(contactUid),
  });
};

// ─── Notifications ──────────────────────────────────────────
const _fbAddNotification = (uid, data) =>
  _fbDb.collection('users').doc(uid).collection('notifications').add({
    ...data, read: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });

window.fbListenNotifications = (uid, cb) =>
  _fbDb.collection('users').doc(uid).collection('notifications')
    .orderBy('createdAt', 'desc').limit(50)
    .onSnapshot(s => cb(s.docs.map(d => ({ id: d.id, ...d.data() }))));

window.fbMarkAllRead = async (uid) => {
  const snap = await _fbDb.collection('users').doc(uid)
    .collection('notifications').where('read', '==', false).get();
  if (snap.empty) return;
  const batch = _fbDb.batch();
  snap.docs.forEach(d => batch.update(d.ref, { read: true }));
  await batch.commit();
};

window.fbNotifyTripEdit = async (tripId, editorUid, editorName, editorPhoto, tripTitle) => {
  const snap = await _fbDb.collection('groups').doc(tripId).get();
  if (!snap.exists) return;
  const members = (snap.data().members || []).filter(u => u !== editorUid);
  if (!members.length) return;
  await Promise.all(members.map(uid => _fbAddNotification(uid, {
    type: 'trip_edited',
    fromUid: editorUid, fromName: editorName || '', fromPhoto: editorPhoto || '',
    tripId, tripTitle: tripTitle || '',
  })));
};
