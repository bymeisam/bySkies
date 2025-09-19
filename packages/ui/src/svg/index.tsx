import SunIcon from "./sun.svg";
import MoonIcon from "./moon.svg";
import CloudIcon from "./cloud.svg";
import RainIcon from "./rain.svg";
import SnowIcon from "./snow.svg";
import ThunderstormIcon from "./thunderstorm.svg";
import MistIcon from "./mist.svg";
import WarningIcon from "./warning.svg";
import ChevronDownIcon from "./chevron-down.svg";
import StarIcon from "./star.svg";
import MapPinIcon from "./map-pin.svg";
import LoaderIcon from "./loader.svg";

// Using SVGR approach with direct component references
export const svgPaths = {
  sun: SunIcon,
  moon: MoonIcon,
  cloud: CloudIcon,
  rain: RainIcon,
  snow: SnowIcon,
  thunderstorm: ThunderstormIcon,
  mist: MistIcon,
  warning: WarningIcon,
  "chevron-down": ChevronDownIcon,
  star: StarIcon,
  "map-pin": MapPinIcon,
  loader: LoaderIcon,
} as const;

