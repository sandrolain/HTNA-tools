import { LoaderManager } from "../dist/esm/promise.js";

const wait = () => {
  const time = Math.round(Math.random() * 3000);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`waited: ${time}`);
      if(Math.random() < 0.5) {
        resolve();
      } else {
        reject(new Error("err!"));
      }
    }, time);
  });
};

const loader = new LoaderManager({
  beforeStart: (stats) => {
    console.log("beforeStart", stats);
  },
  progress: (stats, passed, total) => {
    console.log("progress", stats, passed, total);
  },
  complete: (stats) => {
    console.warn("complete", stats);
  },
  error: (error) => {
    console.error(error);
  }
});

window.addEventListener("load", () => {
  loader.addPromise([
    wait(),
    wait(),
    wait(),
    wait()
  ]);
});

document.getElementById("add").addEventListener("click", () => {
  loader.addPromise([
    wait()
  ]);
});
