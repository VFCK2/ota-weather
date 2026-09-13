/* O-SORA OneSignal wrapper
 * All OneSignal SDK calls are kept in this module.
 */
(function () {
  'use strict';

  const APP_ID = '5c572571-87e6-426b-a615-513025c5947a';
  const SERVICE_WORKER_PATH = '/ota-weather/push-test/OneSignalSDKWorker.js';
  const SERVICE_WORKER_SCOPE = '/ota-weather/push-test/';

  let sdk = null;
  let initialized = false;
  let initPromise = null;
  const listeners = new Set();

  function emit() {
    const state = getState();
    listeners.forEach(fn => {
      try { fn(state); } catch (e) { console.error(e); }
    });
  }

  function getState() {
    if (!sdk) {
      return { ready: false, supported: false, permission: false, optedIn: false, id: null, token: null };
    }
    const sub = sdk.User?.PushSubscription;
    return {
      ready: initialized,
      supported: !!sdk.Notifications?.isPushSupported?.(),
      permission: !!sdk.Notifications?.permission,
      optedIn: !!sub?.optedIn,
      id: sub?.id || null,
      token: sub?.token || null
    };
  }

  async function init() {
    if (initialized && sdk) return sdk;
    if (initPromise) return initPromise;

    initPromise = new Promise((resolve, reject) => {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function (OneSignal) {
        try {
          sdk = OneSignal;
          await OneSignal.init({
            appId: APP_ID,
            serviceWorkerPath: SERVICE_WORKER_PATH,
            serviceWorkerParam: { scope: SERVICE_WORKER_SCOPE },
            welcomeNotification: { disable: true },
            autoResubscribe: true
          });

          const onPermissionChange = () => emit();
          const onSubscriptionChange = () => emit();
          OneSignal.Notifications.addEventListener('permissionChange', onPermissionChange);
          OneSignal.User.PushSubscription.addEventListener('change', onSubscriptionChange);

          initialized = true;
          emit();
          resolve(OneSignal);
        } catch (e) {
          reject(e);
        }
      });
    });

    try {
      return await initPromise;
    } finally {
      initPromise = null;
    }
  }

  function subscribe(fn) {
    listeners.add(fn);
    try { fn(getState()); } catch (e) { console.error(e); }
    return () => listeners.delete(fn);
  }

  async function requestPermission() {
    const OneSignal = await init();
    if (!OneSignal.Notifications.isPushSupported()) {
      throw new Error('この環境ではWeb Pushに対応していません。');
    }
    await OneSignal.Notifications.requestPermission();
    emit();
    return getState();
  }

  window.OSoraOneSignal = Object.freeze({
    init,
    subscribe,
    requestPermission,
    getState
  });
})();
