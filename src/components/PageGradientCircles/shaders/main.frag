precision highp float;

#pragma glslify: blendSubtract = require(glsl-blend/subtract)

varying vec2 vUV;

uniform vec2 uWindowDimensions;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform float uTime;

vec3 gradientCircle(vec2 uv, vec2 center, float screenAspect, float radius, float offset) {
  uv -= center * vec2(1.0, screenAspect);
  uv /= radius;
  float dist = distance(uv, vec2(0.0));

  // vec2 normalizedUV = normalize(uv);
  // float dotProduct = dot(vec2(0.0, 1.0), normalizedUV);
  // float detProduct = -(1.0 * normalizedUV.x);
  // float angle = atan(dotProduct, detProduct);
  float time = uTime * 0.0003 + offset;
  // dist += cos(0.5 * time) * 0.05;

  vec3 color = uColor1;
  float stop1 = fract(time) + 0.0 - 1.0;
  float stop2 = fract(time) + 0.55 - 1.0;
  float stop3 = fract(time) + 0.75 - 1.0;
  float stop4 = fract(time) + 0.0;
  float stop5 = fract(time) + 0.55;
  float stop6 = fract(time) + 0.75;
  float stop7 = fract(time) + 1.0;

  color = mix(color, uColor2, smoothstep(stop1, stop2, dist));
  color = mix(color, uColor3, smoothstep(stop2, stop3, dist));
  color = mix(color, uColor1, smoothstep(stop3, stop4, dist));
  color = mix(color, uColor2, smoothstep(stop4, stop5, dist));
  color = mix(color, uColor3, smoothstep(stop5, stop6, dist));
  color = mix(color, uColor1, smoothstep(stop6, stop7, dist));

  color = mix(color, vec3(1.0), smoothstep(0.5, 1.0, dist));
  return color;
}

void main() {
  vec2 uv = vUV;
  float screenAspect = uWindowDimensions.y / uWindowDimensions.x;
  uv.y *= screenAspect;
  vec3 circle1 = gradientCircle(uv, vec2(0.2, 0.2), screenAspect, 0.6, 0.0);
  vec3 circle2 = gradientCircle(uv, vec2(0.8, 0.8), screenAspect, 0.15, 0.5);
  vec3 color = blendSubtract(circle1, circle2);
  // vec3 color = gradientCircle(uv, vec2(0.5, 0.5), screenAspect, 0.5);
  gl_FragColor = vec4(color, 1.0);
}