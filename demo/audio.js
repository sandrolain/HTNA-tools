import { createAudioContext, loadAudio, playAudio } from "../dist/esm/audio.js";

const ctx = createAudioContext();

document.getElementById("play").addEventListener("click", async () => {
  const audio = await loadAudio(ctx, "./audio-example.mp3");
  playAudio(ctx, audio);
});
