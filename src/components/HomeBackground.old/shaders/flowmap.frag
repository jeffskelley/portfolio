uniform sampler2D tMap;
uniform float uFalloff;
uniform float uDissipation;
uniform float uAspect;
uniform float uAlpha;
uniform vec2 uMouse;
uniform vec2 uVelocity;

varying vec2 vUV;

void main() {
  vec4 color = texture2D(tMap, vUV) * uDissipation;
  vec2 cursor = vUV - uMouse;
  cursor.x *= uAspect;
  vec3 stamp = vec3(
    uVelocity * vec2(1.0, -1.0),
    1.0 - pow(1.0 - min(1.0, length(uVelocity)), 3.0)
  );
  float falloff = smoothstep(uFalloff, 0.0, length(cursor)) * uAlpha;
  color.rgb = mix(color.rgb, stamp, falloff);
  gl_FragColor = color;
  gl_FragColor.a = uAlpha;
}
