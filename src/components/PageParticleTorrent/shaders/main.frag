varying vec2 vUV;

void main() {
  float color = smoothstep(0.5, 0.49, distance(vUV.xy, vec2(0.5, 0.5)));
  gl_FragColor.rgb = vec3(color);
  gl_FragColor.a = 1.0;
}