// 8bit Audio System using Web Audio API
export class AudioSystem {
  private audioContext: AudioContext | null = null;
  private bgmEnabled: boolean = true;
  private sfxEnabled: boolean = true;
  private bgmInterval: number | null = null;
  private masterGain: GainNode | null = null;

  init(): void {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    this.masterGain.gain.value = 0.3;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'square', volume: number = 0.3): void {
    if (!this.audioContext || !this.masterGain) return;

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
    if (!this.sfxEnabled) return;
    this.playTone(800, 0.05, 'square', 0.1);
  }

  playClick(): void {
    if (!this.sfxEnabled) return;
    this.playTone(600, 0.08, 'square', 0.2);
    setTimeout(() => this.playTone(900, 0.08, 'square', 0.2), 50);
  }

  playSelect(): void {
    if (!this.sfxEnabled) return;
    this.playTone(523, 0.1, 'square', 0.2);
    setTimeout(() => this.playTone(659, 0.1, 'square', 0.2), 100);
    setTimeout(() => this.playTone(784, 0.15, 'square', 0.2), 200);
  }

  startBGM(): void {
    if (!this.bgmEnabled || this.bgmInterval) return;

    const melody = [
      { note: 392, duration: 0.25 },
      { note: 440, duration: 0.25 },
      { note: 494, duration: 0.25 },
      { note: 523, duration: 0.5 },
      { note: 494, duration: 0.25 },
      { note: 440, duration: 0.25 },
      { note: 392, duration: 0.5 },
      { note: 330, duration: 0.25 },
      { note: 349, duration: 0.25 },
      { note: 392, duration: 0.5 },
      { note: 349, duration: 0.25 },
      { note: 330, duration: 0.25 },
      { note: 294, duration: 0.5 },
      { note: 262, duration: 0.5 },
    ];

    const bass = [
      { note: 131, duration: 0.5 },
      { note: 165, duration: 0.5 },
      { note: 196, duration: 0.5 },
      { note: 165, duration: 0.5 },
    ];

    let melodyIndex = 0;
    let bassIndex = 0;
    let beatCount = 0;

    const playBeat = (): void => {
      if (!this.bgmEnabled) return;

      const melodyNote = melody[melodyIndex % melody.length];
      this.playTone(melodyNote.note, melodyNote.duration * 0.8, 'square', 0.06);
      melodyIndex++;

      if (beatCount % 2 === 0) {
        const bassNote = bass[bassIndex % bass.length];
        this.playTone(bassNote.note, bassNote.duration * 0.8, 'triangle', 0.08);
        bassIndex++;
      }

      beatCount++;
    };

    this.bgmInterval = window.setInterval(playBeat, 350);
    playBeat();
  }

  stopBGM(): void {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  toggleBGM(): boolean {
    this.bgmEnabled = !this.bgmEnabled;
    if (this.bgmEnabled) {
      this.startBGM();
    } else {
      this.stopBGM();
    }
    return this.bgmEnabled;
  }

  toggleSFX(): boolean {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }
}

export const audio = new AudioSystem();
