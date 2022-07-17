import { createStore } from 'vuex'

const projectRoot = 'https://github.com/jeffskelley/portfolio/blob/master/src/'

const store = createStore({
  state() {
    return {
      projects: [
        {
          route: { name: 'albumGrid' },
          title: 'Fisheye Album Art Grid',
          tech: ['WebGL', 'GLSL', 'Three.JS', 'GSAP'],
          github: `${projectRoot}/components/PageAlbumGrid`,
        },
        {
          route: { name: 'liquidText' },
          title: 'Liquid Text',
          tech: ['WebGL', 'GLSL', 'Three.JS', 'FBOs'],
          github: `${projectRoot}/components/PageLiquidText`,
        },
        {
          route: { name: 'dripMask' },
          title: 'SVG Drip Mask',
          tech: ['SVG', 'GSAP', 'Canvas'],
          github: `${projectRoot}/components/PageDripMask`,
        },
        {
          route: { name: 'drawToReveal' },
          title: 'Draw to Reveal',
          tech: ['WebGL', 'GLSL', 'Three.JS', 'FBOs'],
          github: `${projectRoot}/components/PageDrawToReveal`,
        },
        {
          route: { name: 'synthwaveOcean' },
          title: 'Synthwave Ocean',
          tech: ['WebGL', 'GLSL', 'Three.JS'],
          github: `${projectRoot}/components/PageSynthwaveOcean`,
        },
      ],
    }
  },
})

export default store
