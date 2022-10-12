varying vec2 vUV;

uniform float uTime;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

#define NUM_OCTAVES 3
float fbm ( in vec2 st) {
    float value = 0.0;
    float alpha = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rotation = mat2(cos(0.5), sin(0.5),
                        -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        value += alpha * snoise2(st);
        st = rotation * st * 2.0 + shift;
        alpha *= 0.5;
    }
    return value;
}

const float timeAmplitude = 0.0005;
const float displacementAmplitude = 0.4;
const float displacementPeriod = 1.0;

void main() {
  vUV = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float distanceFromCenter = smoothstep(0.0, 0.5, distance(uv, vec2(0.5, 0.5)));
  float xDisplacement = fbm(mvPosition.xy * displacementPeriod + vec2(uTime * timeAmplitude, 0.0)) * displacementAmplitude * (1.0 - distanceFromCenter);
  float yDisplacement = fbm(mvPosition.xy * displacementPeriod + vec2(0.0, uTime * timeAmplitude)) * displacementAmplitude * (1.0 - distanceFromCenter);
  vec4 newMvPosition = vec4(mvPosition.x + xDisplacement, mvPosition.y + yDisplacement, mvPosition.z, mvPosition.w);
  gl_Position = projectionMatrix * newMvPosition;
}