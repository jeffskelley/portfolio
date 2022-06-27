varying vec2 vUV;
uniform vec3 uMoonColor1;
uniform vec3 uMoonColor2;

float circle(in vec2 uv, in float _radius){
    vec2 dist = uv-vec2(0.5);
	return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

float pulse(float val){
  float frequency = 40.0;
  return step(
    0.5,
    fract(val * frequency) / 2.0 + (0.5 / 2.0)
  );
}

void main() {
  float alpha = circle(vUV, 0.9) * pulse(vUV.y);
  vec3 gradient = mix(uMoonColor2, uMoonColor1, vUV.y);
  // vec3 color = mix(vec3(0.0, 0.0, 0.0), gradient, pulse(vUV.y));
	gl_FragColor = vec4(gradient, alpha);
}