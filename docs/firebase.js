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
window.fbOnAuth         = (cb)      => {
  // _load() 비동기 → 그 사이 unmount되면 cancelled 플래그로 차단,
  // 콜백 등록 후 진짜 unsubscribe 함수 반환해 호출자가 정리 가능
  let unsub = () => {};
  let cancelled = false;
  _load().then(() => {
    if (cancelled) return;
    unsub = _fbAuth.onAuthStateChanged(cb);
  });
  return () => { cancelled = true; unsub(); };
};

// ─── User document ───────────────────────────────────────────
window.fbGetOrCreateUser = async (fbUser) => {
  await _load();
  const ref  = _fbDb.collection('users').doc(fbUser.uid);
  const snap = await ref.get({ source: 'server' }).catch(() => ref.get());
  const isOwner = fbUser.email === SAMPLE_OWNER_EMAIL;
  if (!snap.exists) {
    // 신규 유저: 빈 tripIds로 시작
    const data = {
      displayName : fbUser.displayName || '여행자',
      email       : fbUser.email       || '',
      photoURL    : fbUser.photoURL    || '',
      groupId     : fbUser.uid,
      tripIds     : [],
      createdAt   : firebase.firestore.FieldValue.serverTimestamp(),
    };
    await ref.set(data);
    const initPrep = (window.TRIP_DEFAULT?.prep?.cats?.length)
      ? window.TRIP_DEFAULT.prep
      : { cats: [{ id:'cat_1', name:'체크리스트', items:[] }] };
    await _fbDb.collection('preps').doc(fbUser.uid).set({ prep: initPrep });
    return { ...data, uid: fbUser.uid };
  }
  const existing = snap.data();

  // tripIds 정리: 실제 멤버로 남아있는 여행만 유지
  const tripIds = existing.tripIds != null ? existing.tripIds : [];
  const groupSnaps = await Promise.all(tripIds.map(id => _fbDb.collection('groups').doc(id).get()));
  const validTripIds = tripIds.filter((id, i) =>
    groupSnaps[i].exists &&
    (groupSnaps[i].data().members || []).includes(fbUser.uid)
  );

  // groups 컬렉션에서 내가 멤버인 여행 중 tripIds에 없는 것도 추가 (다른 유저가 직접 추가한 경우)
  const memberSnap = await _fbDb.collection('groups').where('members', 'array-contains', fbUser.uid).get();
  const memberTripIds = memberSnap.docs.map(d => d.id);
  const extraIds = memberTripIds.filter(id => !validTripIds.includes(id)).sort();
  const allTripIds = [...validTripIds, ...extraIds];

  if (JSON.stringify(allTripIds) !== JSON.stringify(existing.tripIds || [])) {
    await ref.update({ tripIds: allTripIds });
  }
  return { uid: fbUser.uid, ...existing, tripIds: allTripIds };
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

// ─── Personal prep (per-user per-trip) ────────────────────────
window.fbListenPersonalPrep = (uid, tripId, cb) =>
  _fbDb.collection('preps').doc(uid)
    .onSnapshot(s => cb(s.exists ? (s.data()[tripId] ?? null) : null));

window.fbSavePersonalPrep = (uid, tripId, prep) =>
  _fbDb.collection('preps').doc(uid).set({ [tripId]: prep }, { merge: true });

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

window.fbRejectInvite = async (id) => {
  const invSnap = await _fbDb.collection('invites').doc(id).get();
  if (invSnap.exists) {
    const { fromUid, toUid, type } = invSnap.data();
    if (type === 'contact' && fromUid && toUid) {
      await _fbDb.collection('users').doc(fromUid).update({
        contacts: firebase.firestore.FieldValue.arrayRemove(toUid),
      }).catch(() => {});
    }
  }
  await _fbDb.collection('invites').doc(id).update({ status: 'rejected' });
};

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
// ─── 임시: 마이그레이션된 NYC 여행 삭제 ──────────────────────────
window.fbDeleteMigratedNYC = async () => {
  const user = _fbAuth.currentUser;
  if (!user) return '로그인 필요';
  const ref = _fbDb.collection('users').doc(user.uid);
  const snap = await ref.get();
  const tripIds = snap.data()?.tripIds || [];
  const trips = await Promise.all(tripIds.map(id => _fbDb.collection('groups').doc(id).get()));
  const nycTrip = trips.find(s => s.exists && (s.data().title || '').toLowerCase().includes('new york'));
  if (!nycTrip) return 'NYC 여행을 찾을 수 없음 (tripIds: ' + JSON.stringify(tripIds) + ')';
  const id = nycTrip.id;
  await _fbDb.collection('groups').doc(id).delete();
  await ref.update({ tripIds: firebase.firestore.FieldValue.arrayRemove(id) });
  return '삭제 완료: ' + id;
};

window.fbLoadTrips = async (tripIds) => {
  if (!tripIds || !tripIds.length) return [];
  const snaps = await Promise.all(
    tripIds.map(id => _fbDb.collection('groups').doc(id).get())
  );
  return snaps.filter(s => s.exists).map(s => ({ id: s.id, ...s.data() }));
};

window.fbCreateNewTrip = async (uid, title, hue) => {
  const ref = _fbDb.collection('groups').doc();
  const tripId = ref.id;
  if (hue === undefined) hue = Math.floor(Math.random() * 360);
  const defaultPrep = window.TRIP_DEFAULT?.prep?.cats?.length ? window.TRIP_DEFAULT.prep : { cats: [] };
  await ref.set({
    title, dates: '', hotel: '', days: [], hotels: [], food: [],
    prep: defaultPrep,
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
    contacts: firebase.firestore.FieldValue.arrayUnion(invite.fromUid),
  });
  await _fbDb.collection('users').doc(invite.fromUid).update({
    contacts: firebase.firestore.FieldValue.arrayUnion(myUid),
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

window.fbUploadDayPhoto = async (uid, tripId, dayIdx, blob) => {
  const storage = firebase.storage();
  const ref = storage.ref(`user-photos/${uid}/${tripId}/${dayIdx}`);
  await ref.putString(blob, 'data_url', { contentType: 'image/jpeg' });
  return await ref.getDownloadURL();
};

window.fbDeleteDayPhoto = async (uid, tripId, dayIdx) => {
  const storage = firebase.storage();
  await storage.ref(`user-photos/${uid}/${tripId}/${dayIdx}`).delete();
};

window.fbUploadTicket = async (uid, tripId, ticketId, file) => {
  const storage = firebase.storage();
  const ref = storage.ref(`user-photos/${uid}/${tripId}/ticket_${ticketId}`);
  await ref.put(file, { contentType: file.type });
  return await ref.getDownloadURL();
};

window.fbDeleteTicket = async (uid, tripId, ticketId) => {
  const storage = firebase.storage();
  await storage.ref(`user-photos/${uid}/${tripId}/ticket_${ticketId}`).delete();
};

window.fbDeleteTripPhotos = async (uid, tripId, dayCount) => {
  const storage = firebase.storage();
  const tasks = [];
  for (let i = 0; i < dayCount; i++) {
    tasks.push(
      storage.ref(`user-photos/${uid}/${tripId}/${i}`).delete().catch(() => {})
    );
  }
  await Promise.all(tasks);
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

window.fbAddTripMember = async (fromUser, toUid, tripId, tripTitle) => {
  await _fbDb.collection('groups').doc(tripId).update({
    members: firebase.firestore.FieldValue.arrayUnion(toUid),
    [`permissions.${toUid}`]: 'edit',
  });
  // 상대방 tripIds 업데이트 — 보안 규칙상 실패해도 무시 (상대방 로그인 시 자동 동기화됨)
  await _fbDb.collection('users').doc(toUid).update({
    tripIds: firebase.firestore.FieldValue.arrayUnion(tripId),
  }).catch(() => {});
  _fbAddNotification(toUid, {
    type: 'trip_member_added',
    fromUid: fromUser.uid, fromName: fromUser.displayName || '', fromPhoto: fromUser.photoURL || '',
    tripId, tripTitle: tripTitle || '',
  }).catch(() => {});
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
  // 기존 pending contact invite 중복 체크
  const ex = await _fbDb.collection('invites')
    .where('fromUid','==',myUid).where('toUid','==',toUser.uid)
    .where('type','==','contact').where('status','==','pending').get();
  if (!ex.empty) return { error: '이미 신청을 보냈습니다.' };
  // 내 연락처에만 단방향 추가 (상대방은 수락 후 추가됨)
  const mySnap = await _fbDb.collection('users').doc(myUid).get();
  const myData = mySnap.exists ? mySnap.data() : {};
  await _fbDb.collection('users').doc(myUid).update({
    contacts: firebase.firestore.FieldValue.arrayUnion(toUser.uid),
  });
  // 연락처 초대 생성 (대기 중 표시용)
  await _fbDb.collection('invites').add({
    fromUid: myUid, fromName: myData.displayName || '', fromPhoto: myData.photoURL || '',
    toUid: toUser.uid, toEmail: toUser.email,
    type: 'contact',
    status: 'pending',
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  _fbAddNotification(toUser.uid, {
    type: 'contact_added',
    fromUid: myUid, fromName: myData.displayName || '', fromPhoto: myData.photoURL || '',
  }).catch(() => {});
  return { success: true, toName: toUser.displayName };
};

window.fbAcceptContactInvite = async (invite, myUid) => {
  await _fbDb.collection('invites').doc(invite.id).update({ status: 'accepted' });
  // 상대방을 내 연락처에 추가 (상대는 이미 자기 연락처에 나를 추가함)
  await _fbDb.collection('users').doc(myUid).update({
    contacts: firebase.firestore.FieldValue.arrayUnion(invite.fromUid),
  });
  const mySnap = await _fbDb.collection('users').doc(myUid).get();
  const myData = mySnap.exists ? mySnap.data() : {};
  _fbAddNotification(invite.fromUid, {
    type: 'contact_accepted',
    fromUid: myUid, fromName: myData.displayName || '', fromPhoto: myData.photoURL || '',
  }).catch(() => {});
};

window.fbGetContacts = async (uid) => {
  const snap = await _fbDb.collection('users').doc(uid).get();
  const ids = snap.data()?.contacts || [];
  if (!ids.length) return [];
  return window.fbGetUsersById(ids);
};

// contacts 실시간 리스너 — 상대방이 삭제해도 즉시 반영
window.fbListenContacts = (uid, cb) => {
  let alive = true;
  const unsub = _fbDb.collection('users').doc(uid).onSnapshot(async snap => {
    const ids = snap.data()?.contacts || [];
    if (!ids.length) { if (alive) cb([]); return; }
    const users = await window.fbGetUsersById(ids).catch(() => []);
    if (alive) cb(users);
  });
  return () => { alive = false; unsub(); };
};

window.fbRemoveContact = async (myUid, contactUid) => {
  // 내 contacts에서 제거 (항상 성공 — 내 문서라 권한 있음)
  await _fbDb.collection('users').doc(myUid).update({
    contacts: firebase.firestore.FieldValue.arrayRemove(contactUid),
  });
  // 상대방 contacts에서도 나 제거 — best effort (보안 규칙 허용 시 성공)
  _fbDb.collection('users').doc(contactUid).update({
    contacts: firebase.firestore.FieldValue.arrayRemove(myUid),
  }).catch(() => {});
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

window.fbDeleteNotification = (uid, notifId) =>
  _fbDb.collection('users').doc(uid).collection('notifications').doc(notifId).delete();

window.fbDeleteAllNotifications = async (uid) => {
  const snap = await _fbDb.collection('users').doc(uid).collection('notifications').get();
  if (snap.empty) return;
  const batch = _fbDb.batch();
  snap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
};

window.fbPruneOldNotifications = async (uid) => {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const snap = await _fbDb.collection('users').doc(uid).collection('notifications')
    .where('createdAt', '<', cutoff).get();
  if (snap.empty) return;
  const batch = _fbDb.batch();
  snap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
};

window.fbMarkAllRead = async (uid) => {
  const snap = await _fbDb.collection('users').doc(uid)
    .collection('notifications').where('read', '==', false).get();
  if (snap.empty) return;
  const batch = _fbDb.batch();
  snap.docs.forEach(d => batch.update(d.ref, { read: true }));
  await batch.commit();
};

// ─── Sample trips (pull-based sync) ──────────────────────────
const SAMPLE_OWNER_EMAIL = 'arjungtaeng@gmail.com';

// Get current sample data + version from Firestore
window.fbGetSample = async (sampleId) => {
  const snap = await _fbDb.collection('samples').doc(sampleId).get();
  return snap.exists ? snap.data() : null;
};

// Owner: update sample when they save their trip
window.fbUpdateSample = async (sampleId, tripData) => {
  const sampleSnap = await _fbDb.collection('samples').doc(sampleId).get();
  const currentVersion = sampleSnap.exists ? (sampleSnap.data().sampleVersion || 0) : 0;
  const { sampleId: _a, sampleVersion: _b, members: _c, createdAt: _d, ...cleanData } = tripData;
  await _fbDb.collection('samples').doc(sampleId).set({
    tripData: cleanData,
    sampleVersion: currentVersion + 1,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
};

// On app open: add or update sample trip for non-owner users
// Returns { tripId, updated, isNew } or null if sample should not be shown
window.fbSyncSample = async (uid, userEmail, sampleId) => {
  // 오너는 자신이 관리하는 샘플(nyc)만 건너뜀 — 다른 샘플은 받음
  if (userEmail === SAMPLE_OWNER_EMAIL && sampleId === 'nyc') return null;

  const userSnap = await _fbDb.collection('users').doc(uid).get();
  if (!userSnap.exists) return null;
  const ud = userSnap.data();
  if ((ud.deletedSamples || []).includes(sampleId)) return null;

  const sampleSnap = await _fbDb.collection('samples').doc(sampleId).get();
  // Firestore에 샘플이 없으면 로컬 데이터로 폴백
  const localData = sampleId === 'nyc' ? (window.TRIP_DEFAULT || null)
                  : sampleId === 'rome' ? (window.ROME_DEFAULT || null)
                  : null;
  if (!sampleSnap.exists && !localData) return null;
  // 로컬 data.js 버전이 Firestore보다 높으면 로컬을 정본으로 사용 (업데이트 강제용)
  const localVersion = localData?.sampleVersion || 1;
  const firestoreVersion = sampleSnap.exists ? (sampleSnap.data().sampleVersion || 1) : 0;
  const sampleVersion = Math.max(firestoreVersion, localVersion);
  const tripData = (localVersion > firestoreVersion && localData)
    ? localData
    : (sampleSnap.exists ? sampleSnap.data().tripData : localData);

  const userVersion = (ud.sampleVersions || {})[sampleId] || 0;
  const tripIds = ud.tripIds || [uid];
  const tripSnaps = await Promise.all(tripIds.map(id => _fbDb.collection('groups').doc(id).get()));
  const sampleTripSnap = tripSnaps.find(s => s.exists && s.data().sampleId === sampleId);

  if (!sampleTripSnap) {
    // Transaction으로 원자적 생성 — 동시 호출 시 중복 생성 방지
    let tripId = null;
    let created = false;
    await _fbDb.runTransaction(async (tx) => {
      const freshSnap = await tx.get(_fbDb.collection('users').doc(uid));
      if (!freshSnap.exists) return;
      const freshUd = freshSnap.data();
      // 이미 다른 호출이 먼저 생성했으면 건너뜀
      if ((freshUd.sampleVersions || {})[sampleId] > 0) return;
      const ref = _fbDb.collection('groups').doc();
      tripId = ref.id;
      const hue = tripData.hue ?? tripData.days?.[0]?.hero?.hue ?? 25;
      tx.set(ref, {
        ...tripData, sampleId, sampleVersion,
        members: [uid], hue,
        createdAt: new Date(),
      });
      tx.update(_fbDb.collection('users').doc(uid), {
        tripIds: firebase.firestore.FieldValue.arrayUnion(tripId),
        [`sampleVersions.${sampleId}`]: sampleVersion,
      });
      created = true;
    });
    if (!created) return null;
    return { tripId, updated: true, isNew: true, tripData };
  }

  if (sampleVersion > userVersion) {
    // Sample was updated — sync to user's copy (keep their members list)
    const existing = sampleTripSnap.data();
    await _fbDb.collection('groups').doc(sampleTripSnap.id).set({
      ...tripData, sampleId, sampleVersion,
      members: existing.members || [uid],
    });
    await _fbDb.collection('users').doc(uid).update({
      [`sampleVersions.${sampleId}`]: sampleVersion,
    });
    return { tripId: sampleTripSnap.id, updated: true, isNew: false, tripData };
  }

  return { tripId: sampleTripSnap.id, updated: false };
};

// Called when user deletes a sample trip
window.fbMarkSampleDeleted = async (uid, sampleId) => {
  await _fbDb.collection('users').doc(uid).update({
    deletedSamples: firebase.firestore.FieldValue.arrayUnion(sampleId),
  });
};

window.fbUnmarkSampleDeleted = async (uid, sampleId) => {
  await _fbDb.collection('users').doc(uid).update({
    deletedSamples: firebase.firestore.FieldValue.arrayRemove(sampleId),
  });
};

// ─── 계정 탈퇴 ────────────────────────────────────────────────
// 1) Google 재인증 → 2) Firestore 데이터 삭제 → 3) Auth 계정 삭제
window.fbDeleteAccount = async (uid, tripIds) => {
  // Google 재인증 (Firebase Auth 계정 삭제 전 필수)
  const user = _fbAuth.currentUser;
  if (!user) throw new Error('로그인 상태가 아닙니다');
  const provider = new firebase.auth.GoogleAuthProvider();
  await user.reauthenticateWithPopup(provider);

  // Firestore: 본인이 유일한 멤버인 trip만 삭제 (공유 trip은 멤버에서만 제거)
  const groupSnaps = await Promise.all((tripIds || []).map(id => _fbDb.collection('groups').doc(id).get()));
  const batch = _fbDb.batch();
  groupSnaps.forEach((snap, i) => {
    if (!snap.exists) return;
    const members = snap.data().members || [];
    if (members.length <= 1) {
      // 나만 있는 trip → 완전 삭제
      batch.delete(_fbDb.collection('groups').doc(tripIds[i]));
    } else {
      // 다른 멤버도 있는 trip → 멤버에서만 제거
      batch.update(_fbDb.collection('groups').doc(tripIds[i]), {
        members: firebase.firestore.FieldValue.arrayRemove(uid),
      });
    }
  });
  batch.delete(_fbDb.collection('users').doc(uid));
  batch.delete(_fbDb.collection('preps').doc(uid));
  await batch.commit();

  // notifications 서브컬렉션 삭제 (부모 문서 삭제로 자동 삭제 안됨)
  const notifSnap = await _fbDb.collection('users').doc(uid).collection('notifications').get();
  if (!notifSnap.empty) {
    const nb = _fbDb.batch();
    notifSnap.docs.forEach(d => nb.delete(d.ref));
    await nb.commit();
  }

  // Firebase Auth 계정 삭제
  await user.delete();
};

// ─── Trip copy (일정 복사 보내기) ────────────────────────────────
window.fbSendTripCopy = async (fromUser, toEmail, trip) => {
  const toUser = await fbSearchUser(toEmail);
  if (!toUser)                     return { error: '가입된 사용자가 없습니다.' };
  if (toUser.uid === fromUser.uid) return { error: '자기 자신에게는 보낼 수 없습니다.' };
  const tripSnapshot = {
    title   : trip.title   || '',
    dates   : trip.dates   || '',
    days    : trip.days    || [],
    hotels  : trip.hotels  || [],
    food    : trip.food    || [],
    hue     : trip.hue     ?? 25,
  };
  await _fbDb.collection('invites').add({
    fromUid  : fromUser.uid, fromName : fromUser.displayName || '',
    fromEmail: fromUser.email,       fromPhoto: fromUser.photoURL || '',
    toUid    : toUser.uid,  toEmail  : toUser.email,
    type     : 'trip_copy',
    tripTitle: trip.title || '', tripSnapshot,
    status   : 'pending',
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  _fbAddNotification(toUser.uid, {
    type    : 'trip_copy_received',
    fromUid : fromUser.uid, fromName : fromUser.displayName || '', fromPhoto: fromUser.photoURL || '',
    tripTitle: trip.title || '',
  }).catch(() => {});
  return { success: true, toName: toUser.displayName };
};

window.fbAcceptTripCopy = async (invite, myUid) => {
  await _fbDb.collection('invites').doc(invite.id).update({ status: 'accepted' });
  const snap = invite.tripSnapshot || {};
  const ref  = _fbDb.collection('groups').doc();
  const tripId = ref.id;
  await ref.set({
    title      : snap.title  || '',
    dates      : snap.dates  || '',
    hotel      : '',
    days       : snap.days   || [],
    hotels     : snap.hotels || [],
    food       : snap.food   || [],
    members    : [myUid],
    hue        : snap.hue ?? Math.floor(Math.random() * 360),
    permissions: { [myUid]: 'owner' },
    createdAt  : firebase.firestore.FieldValue.serverTimestamp(),
  });
  await _fbDb.collection('users').doc(myUid).update({
    tripIds: firebase.firestore.FieldValue.arrayUnion(tripId),
  });
  // 보낸 사람에게 수락 알림
  const mySnap = await _fbDb.collection('users').doc(myUid).get();
  const myData = mySnap.exists ? mySnap.data() : {};
  _fbAddNotification(invite.fromUid, {
    type: 'trip_copy_accepted',
    fromUid: myUid, fromName: myData.displayName || '', fromPhoto: myData.photoURL || '',
    tripTitle: invite.tripTitle || '',
  }).catch(() => {});
  return tripId;
};

window.fbNotifyTripEdit = async (tripId, editorUid, editorName, editorPhoto, tripTitle, changeDesc) => {
  const snap = await _fbDb.collection('groups').doc(tripId).get();
  if (!snap.exists) return;
  const members = (snap.data().members || []).filter(u => u !== editorUid);
  if (!members.length) return;
  await Promise.all(members.map(uid => _fbAddNotification(uid, {
    type: 'trip_edited',
    fromUid: editorUid, fromName: editorName || '', fromPhoto: editorPhoto || '',
    tripId, tripTitle: tripTitle || '',
    ...(changeDesc ? { changeDesc } : {}),
  })));
};

// ─── FCM 푸시 알림 ────────────────────────────────────────────
const VAPID_KEY = 'BLWRMiI4aTE95xIUSBgp-ZAcU5zqgDMUgd85V2NKpIvFyqxaqKMNdU-tL-m7nlA_TaQ3U_tV1xPiBp915bLhpgg';

// 세션당 1회 init 가드 — 매 로그인마다 getToken/Firestore write 반복 방지
let _fcmInitialized = false;
const _LS_FCM_TOKEN = 'tlj_fcm_token';
window.fbInitPush = async (uid) => {
  try {
    if (_fcmInitialized) return;
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;
    const reg = await navigator.serviceWorker.ready;
    const messaging = firebase.messaging();
    const token = await messaging.getToken({ vapidKey: VAPID_KEY, serviceWorkerRegistration: reg });
    if (token) {
      // 이전 토큰과 동일하면 Firestore write 스킵 (코스트/쓰기 한도 절약)
      let prev = null;
      try { prev = localStorage.getItem(_LS_FCM_TOKEN); } catch(_) {}
      if (prev !== token) {
        await _fbDb.collection('users').doc(uid).update({ fcmToken: token });
        try { localStorage.setItem(_LS_FCM_TOKEN, token); } catch(_) {}
      }
    }
    _fcmInitialized = true;
    // 토큰 갱신 처리
    messaging.onTokenRefresh(async () => {
      const newToken = await messaging.getToken({ vapidKey: VAPID_KEY, serviceWorkerRegistration: reg });
      if (newToken) {
        await _fbDb.collection('users').doc(uid).update({ fcmToken: newToken });
        try { localStorage.setItem(_LS_FCM_TOKEN, newToken); } catch(_) {}
      }
    });
  } catch (e) {
    console.warn('FCM init:', e);
  }
};
