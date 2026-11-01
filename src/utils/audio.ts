/**
 * Web Audio API Sound Synthesizer for Clock Ticks, Hourly Chimes, and Alarms
 */

class SoundSynth {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft clock tick
  playTick(type: 'soft' | 'wood' | 'metallic' = 'soft') {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type === 'wood' ? 'triangle' : type === 'metallic' ? 'sine' : 'sine';
      
      const freq = type === 'wood' ? 600 : type === 'metallic' ? 1200 : 800;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch {
      // Ignore audio context errors on un-interacted DOM
    }
  }

  // Pleasant hourly chime
  playChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.25);
      });
    } catch {
      // Ignore
    }
  }

  // Alarm sound (repeating chime pattern)
  playAlarmPattern(): () => void {
    let active = true;
    let timerId: number | null = null;

    const ringOnce = () => {
      if (!active) return;
      try {
        this.initCtx();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        [880, 1174.66, 880, 1174.66].forEach((freq, i) => {
          if (!this.ctx || !active) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + i * 0.15);

          gain.gain.setValueAtTime(0.08, now + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.12);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + i * 0.15);
          osc.stop(now + i * 0.15 + 0.13);
        });
      } catch {
        // Ignore
      }
    };

    ringOnce();
    timerId = window.setInterval(ringOnce, 1200);

    return () => {
      active = false;
      if (timerId) clearInterval(timerId);
    };
  }
}

export const soundSynth = new SoundSynth();
