// Sound Effects System using Web Audio API (効果音のみ)
export class AudioSystem {
  private audioContext: AudioContext | null = null;
  private sfxEnabled: boolean = true;
  private masterGain: GainNode | null = null;

  init(): void {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    this.masterGain.gain.value = 0.3;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'square', volume: number = 0.3): void {
    if (!this.audioContext || !this.masterGain || !this.sfxEnabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playHover(): void {
    this.playTone(800, 0.05, 'square', 0.1);
  }

  playClick(): void {
    this.playTone(600, 0.08, 'square', 0.2);
    setTimeout(() => this.playTone(900, 0.08, 'square', 0.2), 50);
  }

  playSelect(): void {
    this.playTone(523, 0.1, 'square', 0.2);
    setTimeout(() => this.playTone(659, 0.1, 'square', 0.2), 100);
    setTimeout(() => this.playTone(784, 0.15, 'square', 0.2), 200);
  }
}

export const audio = new AudioSystem();
