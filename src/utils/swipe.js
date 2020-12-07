const SWIPE_MAP = {
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  LEFT: "ArrowLeft",
};

let touchsurface,
  swipedir,
  startX,
  startY,
  distX,
  distY,
  threshold = 50, //required min distance traveled to be considered swipe
  restraint = 100, // maximum distance allowed at the same time in perpendicular direction
  allowedTime = 300, // maximum time allowed to travel that distance
  elapsedTime,
  startTime;

const listenerTouchStart = (event) => {
  const touchobj = event.changedTouches[0];
  swipedir = "NONE";
  startX = touchobj.pageX;
  startY = touchobj.pageY;
  startTime = new Date().getTime(); // record time when finger first makes contact with surface
  event.preventDefault();
};

const listenerTouchMove = (event) => {
  event.preventDefault(); // prevent scrolling when inside DIV
};

const listenerTouchEnd = (event, callback) => {
  const touchobj = event.changedTouches[0];
  distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
  distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
  elapsedTime = new Date().getTime() - startTime; // get time elapsed
  if (elapsedTime <= allowedTime) {
    // first condition for awipe met
    if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
      // 2nd condition for horizontal swipe met
      swipedir = distX < 0 ? SWIPE_MAP.LEFT : SWIPE_MAP.RIGHT; // if dist traveled is negative, it indicates left swipe
    } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
      // 2nd condition for vertical swipe met
      swipedir = distY < 0 ? SWIPE_MAP.UP : SWIPE_MAP.DOWN; // if dist traveled is negative, it indicates up swipe
    }
  }
  callback(swipedir);
  event.preventDefault();
};

const addSwipeListenner = (el, callback) => {
  touchsurface = el;

  touchsurface.addEventListener(
    "touchstart",
    (event) => {
      listenerTouchStart(event);
    },
    false
  );

  touchsurface.addEventListener(
    "touchmove",
    (event) => {
      listenerTouchMove(event);
    },
    false
  );

  touchsurface.addEventListener(
    "touchend",
    (event) => {
      listenerTouchEnd(event, callback);
    },
    false
  );
};

export default addSwipeListenner;
