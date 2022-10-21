import Home from '@/components/PageHome.vue'
import SynthwaveOcean from '@/components/PageSynthwaveOcean'
import LiquidText from '@/components/PageLiquidText'
import DrawToReveal from '@/components/PageDrawToReveal'
import DripMask from '@/components/PageDripMask'
import GradientCircles from '@/components/PageGradientCircles'
import BambooAlbumGrid from '@/components/PageBambooAlbumGrid'
import HomeBackground from '@/components/HomeBackground'

import ParticleTorrent from '@/components/PageParticleTorrent'
import Boids from '@/components/PageBoids'
import BambooStickerPeel from '@/components/PageBambooStickerPeel'

const routes = [
  { name: 'home', path: '/', component: Home },

  { name: 'albumGrid', path: '/album-grid', component: BambooAlbumGrid, meta: { noScroll: true } },
  { name: 'liquidText', path: '/liquid-text', component: LiquidText, meta: { noScroll: true } },
  {
    name: 'drawToReveal',
    path: '/draw-to-reveal',
    component: DrawToReveal,
    meta: { noScroll: true },
  },
  {
    name: 'dripMask',
    path: '/drip-mask',
    component: DripMask,
    meta: { noScroll: true },
  },
  { name: 'boids', path: '/boids', component: Boids, meta: { noScroll: true } },
  {
    name: 'particleTorrent',
    path: '/particle-torrent',
    component: ParticleTorrent,
    meta: { noScroll: true },
  },

  // 3d
  {
    name: 'synthwaveOcean',
    path: '/synthwave-ocean',
    component: SynthwaveOcean,
    meta: { noScroll: true },
  },

  // not added to main yet
  {
    name: 'bambooStickerPeel',
    path: '/bamboo-sticker-peel',
    component: BambooStickerPeel,
    meta: { noScroll: true },
  },
  {
    name: 'gradientCircles',
    path: '/gradient-circles',
    component: GradientCircles,
    meta: { noScroll: true },
  },
  {
    name: 'pageHomeBackground',
    path: '/page-home-background',
    component: HomeBackground,
    meta: { noScroll: true },
  },
]

export default routes
