#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

varying vec2 vUV;
varying vec3 vPosition;

const float displaceDelta = 30.0;
const vec2 noiseDensity = vec2(20.0, 3.0);

float cubicPulse(float x, float center, float width) {
    x = abs(x - center);
    if( x>width ) return 0.0;
    x /= width;
    return 1.0 - x*x*(3.0-2.0*x);
}

void main() {
  vUV = uv;
  vPosition = position;
  vec2 uvNormalized = (uv + 1.0) / 2.0;
  float noise = snoise2(uvNormalized * noiseDensity + vec2(0.0, 0.4));
  vec3 displacement = vec3(0.0, 0.0, pow(noise, .5)) * displaceDelta;
  displacement = displacement * uv.y; // fade in on the y axis
  displacement = displacement * (1.0 - cubicPulse(uv.x, 0.5, 0.2)); // carve out a space for the moon
  vec3 displacedPosition = position + normal * displacement;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}