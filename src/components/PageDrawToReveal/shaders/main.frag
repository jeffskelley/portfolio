uniform sampler2D tMask;
uniform sampler2D tImage1;
uniform sampler2D tImage2;
uniform vec2 uImage1Dimensions;
uniform vec2 uImage2Dimensions;
uniform vec2 uScreenDimensions;

varying vec2 vUV;

vec2 getScaledUV(vec2 uv, vec2 image, vec2 screen) {
  float screenAspect = screen.x / screen.y;
  float imageAspect = image.x / image.y;
  vec2 scaledDimensions = screenAspect < imageAspect ? vec2(image.x * screen.y/image.y, screen.y) : vec2(screen.x, image.y * screen.x/image.x);
  vec2 offset = screenAspect > imageAspect ? vec2(0.0, (scaledDimensions.y - screen.y) / 2.0) : vec2((scaledDimensions.x - screen.x) / 2.0, 0.0);
  return (uv * screen + offset) / scaledDimensions;
}

void main() {
  float mask = texture2D(tMask, vUV).r;
  float maskSharpened = smoothstep(0.4, 0.6, mask);
  vec3 color1 = texture2D(tImage1, getScaledUV(vUV, uImage1Dimensions, uScreenDimensions)).rgb;
  vec3 color2 = texture2D(tImage2, getScaledUV(vUV, uImage2Dimensions, uScreenDimensions)).rgb;
  gl_FragColor.rgb = mix(color1, color2, 1.0 - maskSharpened);
  gl_FragColor.a = 1.0;
}