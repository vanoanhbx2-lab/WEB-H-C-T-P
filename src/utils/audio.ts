/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Hệ thống âm thanh phản hồi và nhạc nền giáo dục nhẹ nhàng
 * Sử dụng thuần Web Audio API (không cần tải file ngoài, hoạt động 100% offline)
 */

let audioCtx: AudioContext | null = null;
let bgmGainNode: GainNode | null = null;
let bgmTimer: number | null = null;
let isBgmPlaying = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/** Phát âm thanh phản hồi thành công nhẹ nhàng (Marimba chime) */
export function playSuccessSound(enabled: boolean = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 (Major chord)

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.12, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.4);
    });
  } catch {
    // Ignore audio failures if browser blocks
  }
}

/** Phát âm thanh click nhẹ nhàng */
export function playClickSound(enabled: boolean = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch {
    // Ignore
  }
}

/** Phát âm thanh xóa / cảnh báo nhẹ */
export function playDeleteSound(enabled: boolean = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.15);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.17);
  } catch {
    // Ignore
  }
}

/** Chuỗi nốt nhạc nền thư giãn pentatonic giáo dục (Lofi / Music box / Celesta) */
const PENTATONIC_MELODY = [
  { note: 261.63, dur: 0.5 }, // C4
  { note: 329.63, dur: 0.5 }, // E4
  { note: 392.00, dur: 0.5 }, // G4
  { note: 440.00, dur: 0.5 }, // A4
  { note: 523.25, dur: 1.0 }, // C5
  { note: 440.00, dur: 0.5 }, // A4
  { note: 392.00, dur: 0.5 }, // G4
  { note: 329.63, dur: 1.0 }, // E4
  { note: 293.66, dur: 0.5 }, // D4
  { note: 329.63, dur: 0.5 }, // E4
  { note: 392.00, dur: 1.0 }, // G4
  { note: 261.63, dur: 1.5 }, // C4
];

/** Bật / Tắt nhạc nền nhẹ nhàng */
export function toggleBackgroundMusic(start: boolean) {
  if (typeof window === 'undefined') return false;

  if (!start) {
    if (bgmTimer) {
      window.clearInterval(bgmTimer);
      bgmTimer = null;
    }
    if (bgmGainNode) {
      try {
        bgmGainNode.gain.setValueAtTime(0, bgmGainNode.context.currentTime);
      } catch {
        // Ignore
      }
    }
    isBgmPlaying = false;
    return false;
  }

  const ctx = getAudioContext();
  if (!ctx) return false;

  bgmGainNode = ctx.createGain();
  bgmGainNode.gain.setValueAtTime(0.035, ctx.currentTime); // Nhạc nền êm dịu, không gây ồn
  bgmGainNode.connect(ctx.destination);

  let step = 0;
  isBgmPlaying = true;

  const playStep = () => {
    if (!isBgmPlaying || !bgmGainNode || !audioCtx) return;
    const current = PENTATONIC_MELODY[step % PENTATONIC_MELODY.length];
    step++;

    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(current.note, audioCtx.currentTime);

    noteGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    noteGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + current.dur * 1.8);

    osc.connect(noteGain);
    noteGain.connect(bgmGainNode);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + current.dur * 2.0);
  };

  // Chơi nốt đầu tiên
  playStep();
  // Lặp lại chuỗi nốt
  bgmTimer = window.setInterval(playStep, 950);

  return true;
}
