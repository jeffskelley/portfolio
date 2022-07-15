import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      projects: [
        {
          route: { name: 'albumGrid' },
          title: 'Fisheye Album Art Grid',
          tech: ['WebGL', 'GLSL', 'Three.JS', 'GSAP'],
        },
        {
          route: { name: 'liquidText' },
          title: 'Liquid Text',
          tech: ['WebGL', 'GLSL', 'Three.JS', 'FBOs'],
        },
        {
          route: { name: 'dripMask' },
          title: 'SVG Drip Mask',
          tech: ['SVG', 'GSAP', 'Canvas'],
        },
        {
          route: { name: 'drawToReveal' },
          title: 'Draw to Reveal',
          tech: ['WebGL', 'GLSL', 'Three.JS', 'FBOs'],
        },
        {
          route: { name: 'synthwaveOcean' },
          title: 'Synthwave Ocean',
          tech: ['WebGL', 'GLSL', 'Three.JS'],
        },
      ],
    }
  },
})

export default store
