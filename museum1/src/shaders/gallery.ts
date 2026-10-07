// ── Marble Floor Material ──────────────────────────────────────────────────
export const MARBLE_UNIFORMS = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
`

export const MARBLE_VERT = `
  ${MARBLE_UNIFORMS}
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const MARBLE_FRAG = `
  ${MARBLE_UNIFORMS}
  uniform float uTime;

  // Hash & noise helpers
  float hash(vec2 p) {
    p = fract(p * vec2(233.31, 851.73));
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1,0)), f.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0; a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv * 6.0;
    
    // Marble veining
    float n = fbm(uv + fbm(uv + fbm(uv)));
    float marble = sin(uv.x * 2.0 + n * 8.0) * 0.5 + 0.5;
    
    // Base marble colors (warm cream + grey veins)
    vec3 col1 = vec3(0.88, 0.84, 0.76); // warm cream
    vec3 col2 = vec3(0.72, 0.68, 0.62); // grey vein
    vec3 col3 = vec3(0.94, 0.91, 0.86); // highlight
    
    vec3 baseColor = mix(col1, col2, smoothstep(0.3, 0.7, marble));
    baseColor = mix(baseColor, col3, smoothstep(0.8, 1.0, marble));
    
    // Spotlight reflections on floor
    vec3 lightPos = vec3(0.0, 5.0, 0.0);
    float dist = length(vPosition - lightPos) * 0.2;
    float reflection = pow(max(0.0, 1.0 - dist), 3.0) * 0.25;
    
    // Warm museum light tint
    baseColor = mix(baseColor, vec3(1.0, 0.85, 0.6), 0.08);
    baseColor += reflection;
    
    // Subtle animated shimmer
    float shimmer = sin(vUv.x * 20.0 + uTime * 0.5) * sin(vUv.y * 20.0 + uTime * 0.3) * 0.015;
    baseColor += shimmer;
    
    gl_FragColor = vec4(baseColor, 1.0);
  }
`

// ── Dust Motes / Particles in Spotlight ────────────────────────────────────
export const DUST_VERT = `
  uniform float uTime;
  uniform float uSize;
  attribute float aOffset;
  attribute float aSpeed;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    // Drift upward slowly and laterally
    pos.y += mod(uTime * aSpeed * 0.15 + aOffset * 4.0, 5.0);
    pos.x += sin(uTime * 0.2 + aOffset * 6.28) * 0.3;
    pos.z += cos(uTime * 0.15 + aOffset * 6.28) * 0.3;

    // Spotlight cone falloff (fade near edges)
    float radialDist = length(pos.xz - vec2(0.0, -1.0));
    vAlpha = smoothstep(1.8, 0.2, radialDist) * smoothstep(5.0, 1.5, pos.y) * 0.6;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * (300.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`

export const DUST_FRAG = `
  varying float vAlpha;
  void main() {
    // Soft circular particle
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float alpha = smoothstep(1.0, 0.0, d) * vAlpha;
    gl_FragColor = vec4(1.0, 0.92, 0.72, alpha);
  }
`

// ── Painting Frame Glow Shader ──────────────────────────────────────────────
export const FRAME_GLOW_FRAG = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    // Edge glow effect
    vec2 uv = vUv;
    float edge = 1.0 - min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)) * 8.0;
    edge = clamp(edge, 0.0, 1.0);
    float pulse = sin(uTime * 2.0) * 0.3 + 0.7;
    gl_FragColor = vec4(uColor * edge * pulse, edge * 0.4 * pulse);
  }
`
