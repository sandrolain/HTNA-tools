
// TODO: test
// TODO: docs
export function createAudioContext (): AudioContext {
  if(window.AudioContext) {
    return new AudioContext();
  }
  if((window as any).webkitAudioContext) {
    return new (window as any).webkitAudioContext();
  }
  return null;
}

// TODO: test
// TODO: docs
export function createAudioBuffer (context: AudioContext, buffer: ArrayBuffer): Promise<AudioBuffer> {
  return context.decodeAudioData(buffer);
}

// TODO: test
// TODO: docs
export async function loadAudio (context: AudioContext, url: string): Promise<AudioBuffer> {
  const response       = await fetch(url);
  if(!response.ok) {
    throw new Error(`Cannot load audio file "${url}"`);
  }
  return createAudioBuffer(context, await response.arrayBuffer());
}

// TODO: test
// TODO: docs
export function createAudioSource (context: AudioContext, buffer: AudioBuffer): AudioBufferSourceNode {
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  return source;
}

// TODO: test
// TODO: docs
export class AudioItem {
  private audioSource: AudioBufferSourceNode;

  constructor (
    private context: AudioContext,
    private audioBuffer: AudioBuffer
  ) {
  }

  play (when: number = 0, offset: number = 0, duration?: number): void {
    this.stop();
    this.audioSource = createAudioSource(this.context, this.audioBuffer);
    this.audioSource.start(when, offset, duration);
  }

  stop (): void {
    if(this.audioSource) {
      this.audioSource.stop();
    }
  }

  static async createFromURL (context: AudioContext, url: string): Promise<AudioItem> {
    const audioBuffer = await loadAudio(context, url);
    return new AudioItem(context, audioBuffer);
  }

  static async createFromArrayBuffer (context: AudioContext, buffer: ArrayBuffer): Promise<AudioItem> {
    const audioBuffer = await createAudioBuffer(context, buffer);
    return new AudioItem(context, audioBuffer);
  }
}
