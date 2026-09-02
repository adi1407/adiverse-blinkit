import {
  Salad,
  Milk,
  Wheat,
  Flame,
  Cookie,
  Drumstick,
  CupSoda,
  Popcorn,
  Sparkles,
  Sparkle,
  SprayCan,
  Baby,
  PawPrint,
  Zap,
  Percent,
  Cross,
  Pill,
  ShoppingBag,
} from "lucide-react-native";

const MAP = {
  Salad,
  Milk,
  Wheat,
  Flame,
  Cookie,
  Drumstick,
  CupSoda,
  Popcorn,
  Sparkles,
  Sparkle,
  SprayCan,
  Baby,
  PawPrint,
  Zap,
  Percent,
  Cross,
  Pill,
  ShoppingBag,
};

export function getLucideIcon(name) {
  return MAP[name] || ShoppingBag;
}
