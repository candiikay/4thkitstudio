import { proxy } from "valtio";

const state = proxy({
    intro: true,
    color: '#EFBD48',
    isLogoTexture: true,
    isFullTexture: false,
    isPatternTexture: false,
    logoDecal: './threejs.png',
    fullDecal: './threejs.png',
    patternTexture: null,
});

export default state;

