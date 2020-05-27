
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
export function createAudioSource (context: AudioContext, buffer: AudioBuffer): AudioBufferSourceNode {
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  return source;
}

// TODO: test
// TODO: docs
export class AudioFromURL {
  private audioBuffer: AudioBuffer;
  private audioSource: AudioBufferSourceNode;

  constructor (
    private context: AudioContext,
    public readonly url: string
  ) {
    this.load();
  }

  async load (): Promise<AudioBuffer> {
    if(!this.audioBuffer) {
      this.audioBuffer = await loadAudio(this.context, this.url);
    }
    return this.audioBuffer;
  }

  play (when: number = 0, offset: number = 0, duration?: number): void {
    if(!this.audioSource) {
      this.audioSource = createAudioSource(this.context, this.audioBuffer);
    }
    this.audioSource.start(when, offset, duration);
  }

  stop (): void {
    if(this.audioSource) {
      this.audioSource.stop();
    }
  }
}
