export const createRefreshManager = (interval, callback) => {
  let timerId = null;
  let isVisible = true;
  let visibilityListener = null;

  const scheduleNext = () => {
    timerId = setTimeout(() => {
      if (isVisible) {
        callback();
      }
      scheduleNext();
    }, interval);
  };

  const setupVisibilityListener = () => {
    visibilityListener = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        callback();
      }
    };
    document.addEventListener("visibilitychange", visibilityListener);
  };

  const start = () => {
    scheduleNext();
    setupVisibilityListener();
  };

  const stop = () => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    if (visibilityListener) {
      document.removeEventListener("visibilitychange", visibilityListener);
      visibilityListener = null;
    }
  };

  return {
    start,
    stop,
  };
};
