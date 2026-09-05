import Svg, {
  Circle,
  Ellipse,
  Path,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  G,
} from "react-native-svg";
import { View, StyleSheet } from "react-native";

/**
 * Abstract festive motifs via SVG — elegant, not cartoon.
 * `illustrationUri` reserved for a future brand asset.
 */
export default function FestivalDecorations({
  decorations = [],
  palette,
  illustrationUri,
}) {
  return (
    <View style={styles.wrap} accessibilityElementsHidden>
      {/* Soft stage orb behind motifs */}
      <View
        style={[
          styles.stage,
          { backgroundColor: palette.soft || "rgba(255,255,255,0.5)" },
        ]}
      />

      <Svg width="100%" height="100%" viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id="featherGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#5B2C8A" stopOpacity="0.9" />
            <Stop offset="55%" stopColor="#2E7D32" stopOpacity="0.75" />
            <Stop offset="100%" stopColor="#F8CB46" stopOpacity="0.85" />
          </LinearGradient>
          <LinearGradient id="matkiGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFE082" />
            <Stop offset="100%" stopColor="#F9A825" />
          </LinearGradient>
          <LinearGradient id="diyaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFF59D" />
            <Stop offset="100%" stopColor="#FF8F00" />
          </LinearGradient>
        </Defs>

        {decorations.includes("peacock") ? (
          <G opacity="0.92">
            <Path
              d="M118 42 C142 58, 148 92, 128 118 C116 102, 108 78, 118 42 Z"
              fill="url(#featherGrad)"
            />
            <Ellipse cx="132" cy="78" rx="10" ry="14" fill="#1B5E20" opacity="0.55" />
            <Circle cx="132" cy="78" r="4.5" fill="#F8CB46" />
            <Path
              d="M118 42 C110 70, 112 100, 122 122"
              stroke="#2C1A4D"
              strokeWidth="1.4"
              fill="none"
              opacity="0.35"
            />
          </G>
        ) : null}

        {decorations.includes("flute") ? (
          <G opacity="0.88">
            <Rect
              x="38"
              y="118"
              width="96"
              height="8"
              rx="4"
              fill="#6D4C41"
              transform="rotate(-18 86 122)"
            />
            {[0, 1, 2, 3].map((i) => (
              <Circle
                key={i}
                cx={52 + i * 14}
                cy={120}
                r="2.2"
                fill="#EFEBE9"
                transform="rotate(-18 86 122)"
              />
            ))}
          </G>
        ) : null}

        {decorations.includes("matki") ? (
          <G>
            <Ellipse cx="64" cy="78" rx="22" ry="26" fill="url(#matkiGrad)" />
            <Ellipse cx="64" cy="58" rx="12" ry="6" fill="#FFF8E1" />
            <Ellipse cx="64" cy="58" rx="8" ry="3.5" fill="#FFE082" />
            <Path
              d="M50 72 Q64 84 78 72"
              stroke="#EF6C00"
              strokeWidth="1.5"
              fill="none"
              opacity="0.45"
            />
          </G>
        ) : null}

        {decorations.includes("diya") ? (
          <G>
            <Ellipse cx="150" cy="148" rx="18" ry="8" fill="#BF360C" opacity="0.85" />
            <Ellipse cx="150" cy="146" rx="14" ry="5" fill="#E65100" />
            <Path
              d="M150 128 C154 136, 154 142, 150 146 C146 142, 146 136, 150 128 Z"
              fill="url(#diyaGrad)"
            />
          </G>
        ) : null}

        {decorations.includes("leaf") ? (
          <G opacity="0.8">
            <Path
              d="M40 50 C70 30, 110 40, 120 70 C90 65, 60 75, 40 50 Z"
              fill="#66BB6A"
            />
            <Path
              d="M40 50 C70 55, 95 60, 120 70"
              stroke="#2E7D32"
              strokeWidth="1.2"
              fill="none"
              opacity="0.5"
            />
          </G>
        ) : null}

        {decorations.includes("bag") ? (
          <G opacity="0.9">
            <Rect x="128" y="70" width="42" height="48" rx="8" fill="#F8CB46" />
            <Path
              d="M140 70 C140 58, 158 58, 158 70"
              stroke="#1F1F1F"
              strokeWidth="3"
              fill="none"
            />
            <Circle cx="149" cy="94" r="6" fill="#0C831F" opacity="0.85" />
          </G>
        ) : null}

        {decorations.includes("spark") ? (
          <G opacity="0.7">
            <Circle cx="46" cy="150" r="3" fill={palette.accent || "#F8CB46"} />
            <Circle cx="170" cy="48" r="2.5" fill={palette.deep || "#2C1A4D"} />
            <Circle cx="96" cy="36" r="2" fill={palette.accent || "#F8CB46"} />
          </G>
        ) : null}
      </Svg>

      {/* Optional future raster illustration slot (not rendered unless provided) */}
      {illustrationUri ? (
        <View style={styles.assetSlot} accessibilityLabel="Festival illustration" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    aspectRatio: 1,
    maxWidth: 220,
    alignSelf: "center",
    justifyContent: "center",
  },
  stage: {
    position: "absolute",
    width: "78%",
    height: "78%",
    borderRadius: 999,
    alignSelf: "center",
    top: "11%",
    opacity: 0.55,
  },
  assetSlot: {
    ...StyleSheet.absoluteFillObject,
  },
});
