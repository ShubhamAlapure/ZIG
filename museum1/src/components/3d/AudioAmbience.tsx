import { useEffect, useRef } from 'react'
import { useGalleryStore } from '../../store/galleryStore'

export function AudioAmbience() {
  const audioEnabled = useGalleryStore((s) => s.audioEnabled)
  const ctxRef = useRef<AudioContext | null>(null)
  const isWalkingRef = useRef(false)
  const nextStepTime = useRef(0)

  // Initialize Web Audio synthesizer for ambient room reverb
  useEffect(() => {
    if (!audioEnabled) {
      if (ctxRef.current) {
        ctxRef.current.suspend()
      }
      return
    }

    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        ctxRef.current = new AudioCtx()
      }
    }

    if (ctxRef.current && ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }

    // Generate gentle warm museum hall room resonance
    const ctx = ctxRef.current
    if (!ctx) return

    try {
      // Pink noise filtered buffer for hall acoustic resonance
      const bufferSize = ctx.sampleRate * 2
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.96900 * b2 + white * 0.1538520
        b3 = 0.86650 * b3 + white * 0.3104856
        b4 = 0.55000 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.0168980
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.008
        b6 = white * 0.115926
      }

      const whiteNoise = ctx.createBufferSource()
      whiteNoise.buffer = noiseBuffer
      whiteNoise.loop = true

      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 420

      const gain = ctx.createGain()
      gain.gain.value = 0.35

      whiteNoise.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      whiteNoise.start(0)
    } catch (e) {
      console.warn('Audio ambience synthesis initialized')
    }
  }, [audioEnabled])

  // Synthesize realistic wooden floor footsteps on key press
  useEffect(() => {
    const onKeyChange = (e: KeyboardEvent) => {
      const keys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
      if (keys.includes(e.code)) {
        isWalkingRef.current = e.type === 'keydown'
      }
    }

    window.addEventListener('keydown', onKeyChange)
    window.addEventListener('keyup', onKeyChange)

    const interval = setInterval(() => {
      if (!isWalkingRef.current || !audioEnabled || !ctxRef.current) return
      const now = ctxRef.current.currentTime
      if (now > nextStepTime.current) {
        playFootstep(ctxRef.current)
        nextStepTime.current = now + 0.46
      }
    }, 100)

    return () => {
      window.removeEventListener('keydown', onKeyChange)
      window.removeEventListener('keyup', onKeyChange)
      clearInterval(interval)
    }
  }, [audioEnabled])

  function playFootstep(ctx: AudioContext) {
    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(75 + Math.random() * 20, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.08)

      filter.type = 'lowpass'
      filter.frequency.value = 320

      gain.gain.setValueAtTime(0.045, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.1)
    } catch (e) {
      // audio safety
    }
  }

  return null
}
