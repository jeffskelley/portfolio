varying vec2 vUV;
uniform vec3 uColor1;
uniform vec3 uColor2;

void main() {
  vec3 gradient = mix(uColor2, uColor1, vUV.y);
	gl_FragColor = vec4(gradient, 1.0);
}