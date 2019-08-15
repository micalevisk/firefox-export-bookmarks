const robot = require('robotjs');

// All this positions below are catched in full screen windows
const mouseActions = [
  [1662, 50], // 1: bookmarker icon
  [1639, 94], // 2: show favs
  [337, 38],  // 3: import and export
  [331, 127], // 4: export favs to HTML...
  { type: 'TYPE_STRING', payload: 'index.html' }, // type file name
  [577, 41],  // 5: file destination search bar
  { type: 'TYPE_STRING', payload: 'C:\\Users\\user\\Desktop' }, // type file target directory
  { type: 'KEY_TAP', payload: 'enter' }, // switch to the directory
  [783, 509], // 6: save button
  [1891, 4],  // 7: close window button
];


function moveMouseAndWait({x, y}, time = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      robot.moveMouse(x, y);
      resolve();
    }, time);
  });
}

const getMousePosition = () => robot.getMousePos();

const mouseLeftClick = () => robot.mouseClick('left');

const typeString = (str) => robot.typeString(str);

const pressKey = (key, modifier = []) => robot.keyTap(key, modifier);


async function performAction({ type, payload }) {
  switch (type) {
    case 'TYPE_STRING':
      return typeString(payload);

    case 'KEY_TAP':
      return pressKey(payload);

    case 'MOVE_AND_CLICK':
      const [x, y] = payload;
      return moveMouseAndWait({x, y}, 700)
        .then(mouseLeftClick);

    default: return;
  }
}

async function run() {
  for await (const mouseAction of mouseActions) {
    console.log(mouseAction);

    await performAction(
      Array.isArray(mouseAction)
      ? { type: 'MOVE_AND_CLICK', payload: mouseAction }
      : mouseAction
    );
  }
}


if (process.argv.pop() === '--mousepos') {
  const {x, y} = getMousePosition();
  console.log([x, y]);
} else {
  run()
}

