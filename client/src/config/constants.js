import { swatch, fileIcon, ai, logoShirt, stylishShirt, download } from "../assets";
import patternIcon from '../assets/patternicon.png';
// import { patternIcon } from "../assets";

export const EditorTabs = [
  {
    name: "colorpicker",
    icon: swatch,
  },
  {
    name: "filepicker",
    icon: fileIcon,
  },
  {
    name: "aipicker",
    icon: ai,
  },
  {
    name: "patterngenerator",
    icon: patternIcon,
  },
];

export const FilterTabs = [
  {
    name: "logoShirt",
    icon: logoShirt,
  },
  {
    name: "stylishShirt",
    icon: stylishShirt,
  },
];

export const Download = [
  {
    name: 'download',
    icon: download
  }
]

export const DecalTypes = {
  logo: {
    stateProperty: "logoDecal",
    filterTab: "logoShirt",
  },
  full: {
    stateProperty: "fullDecal",
    filterTab: "stylishShirt",
  },
  pattern: {  // Add this new type for patterns
    stateProperty: "patternTexture",
    filterTab: "patternShirt",  // You might want to add a new filter tab for patterns
  },
};
