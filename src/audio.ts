
// TODO: test
// TODO: docs
export function createAudioContext (): AudioContext {
  return new AudioContext();
}

// TODO: test
// TODO: docs
export async function loadAudio (context: AudioContext, url: string): Promise<AudioBuffer> {
  const response       = await fetch(url);
  if(!response.ok) {
    throw new Error(`Cannot load audio file "${url}"`);
  }
  const responseBuffer = await response.arrayBuffer();
  return context.decodeAudioData(responseBuffer);
}

// TODO: test
// TODO: docs
export function playAudio (context: AudioContext, buffer: AudioBuffer): AudioBufferSourceNode {
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);
  return source;
}
