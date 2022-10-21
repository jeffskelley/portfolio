varying vec2 vUV;

uniform float uTime;
uniform float uAspect;
uniform sampler2D tMask;

#pragma glslify: snoise2 = require(glsl-noise/simplex/3d)

const float speed = 0.00005;
const float threshold = -0.1;
const float noiseZoom = 0.25;

const float blurZoom = 1.0;
const float blurSpeed = 0.0001;

const vec3 color1 = vec3(0.949,0.518,0.51);
const vec3 color2 = vec3(0.965,0.741,0.376);
const vec3 color3 = vec3(0.961,0.792,0.765);
// const vec3 color3 = vec3(0.969,0.925,0.886);

vec4 blendOver(vec4 a, vec4 b) {
    float newAlpha = mix(b.w, 1.0, a.w);
    vec3 newColor = mix(b.w * b.xyz, a.xyz, a.w);
    float divideFactor = (newAlpha > 0.001 ? (1.0 / newAlpha) : 1.0);
    return vec4(divideFactor * newColor, newAlpha);
}

void main() {
  float mask = texture2D(tMask, vUV).r;
  vec2 uv = vUV;
  // uv = uv * 2.0 - 1.0;
  uv.x *= uAspect;
  // uv = uv / 2.0 + 0.5;

  float time = uTime * speed;
  
  float noise1 = (snoise2(vec3(uv * blurZoom, uTime * blurSpeed)) + 1.0) / 2.0;
  float blur = pow(noise1, 2.0);
  float noise2 = snoise2(vec3((uv + 100.0) * noiseZoom, time) + snoise2(vec3((uv * 2.0 + 100.0) * noiseZoom, time)) * 0.5) / 1.5;
  float noise2blurred = smoothstep(
    threshold - blur / 2.0,
    threshold + blur / 2.0,
    noise2
  );
  vec4 blended = blendOver(vec4(color1, noise2blurred), vec4(color2, 1.0));
  vec3 color = mix(blended.rgb, color3, mask);
  gl_FragColor = vec4(color, 1.0);

  // gl_FragColor = vec4(texture2D(tMask, vUV).rbg, 1.0);
}
