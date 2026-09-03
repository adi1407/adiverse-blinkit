import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import {
  ChevronDown,
  CircleHelp,
  MessageCircle,
  Phone,
  Package,
  Bike,
} from "../utils/lucideIcons";
import ScreenHeader from "../components/ScreenHeader";
import { colors, spacing, radii, shadows } from "../theme/colors";

const FAQS = [
  {
    id: "eta",
    q: "How fast is delivery?",
    a: "This clone demos an 8‑minute promise. Real Blinkit depends on dark-store distance and demand. Order tracking advances on a timer for learning.",
  },
  {
    id: "cancel",
    q: "Can I cancel an order?",
    a: "Yes — only while status is Confirmed (before packing starts). Open Your orders → order detail → Cancel order.",
  },
  {
    id: "coupon",
    q: "How do coupons work?",
    a: "On Cart, pick a chip like BLINKIT50 or FREESHIP. The app previews the discount; the server re-checks it when you place the order.",
  },
  {
    id: "payment",
    q: "Is payment real?",
    a: "No. UPI / Card / Wallet / COD are demo methods. Nothing charges your bank — the order only stores which method you chose.",
  },
  {
    id: "print",
    q: "Does Print upload my files?",
    a: "Files stay on your phone. The backend only saves name, size, and type so you can practice the print-job flow safely.",
  },
  {
    id: "api",
    q: "Home won’t load / API errors?",
    a: "Start the backend on port 5000. On a real phone, set EXPO_PUBLIC_API_URL in frontend/.env to your PC’s Wi‑Fi IP (see README).",
  },
];

const TOPICS = [
  {
    id: "orders",
    title: "Orders & tracking",
    hint: "Status, cancel, rate",
    Icon: Package,
  },
  {
    id: "delivery",
    title: "Delivery partner",
    hint: "Fees & free delivery",
    Icon: Bike,
  },
  {
    id: "chat",
    title: "Demo support note",
    hint: "No live agents here",
    Icon: MessageCircle,
  },
];

function FaqItem({ item, open, onToggle }) {
  return (
    <View style={[styles.faqCard, shadows.soft]}>
      <Pressable style={styles.faqHead} onPress={onToggle}>
        <Text style={styles.faqQ}>{item.q}</Text>
        <ChevronDown
          size={18}
          color={colors.textMuted}
          strokeWidth={2.2}
          style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
        />
      </Pressable>
      {open ? <Text style={styles.faqA}>{item.a}</Text> : null}
    </View>
  );
}

export default function HelpScreen({ navigation }) {
  const [openId, setOpenId] = useState(FAQS[0].id);

  function onTopic(id) {
    if (id === "orders") {
      navigation.navigate("Orders");
      return;
    }
    if (id === "delivery") {
      setOpenId("eta");
      return;
    }
    Alert.alert(
      "Demo support",
      "There’s no live chat in this learning clone. Use the FAQ below or the project README."
    );
  }

  function onCallDemo() {
    Alert.alert(
      "Demo number",
      "No real call center. In a production app this would open tel:+91…",
      [
        { text: "OK" },
        {
          text: "Open dialer anyway",
          onPress: () => Linking.openURL("tel:18002024242").catch(() => {}),
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        showBack
        title="Help & support"
        subtitle="FAQ for this Blinkit clone"
      />
      <View style={styles.curve} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, shadows.soft]}>
          <View style={styles.heroIcon}>
            <CircleHelp size={28} color={colors.accent} strokeWidth={1.8} />
          </View>
          <Text style={styles.heroTitle}>Need a hand?</Text>
          <Text style={styles.heroText}>
            Quick answers for orders, coupons, print, and connecting the API.
          </Text>
        </View>

        <Text style={styles.section}>Quick links</Text>
        <View style={[styles.topicCard, shadows.soft]}>
          {TOPICS.map((topic, index) => {
            const Icon = topic.Icon;
            return (
              <Pressable
                key={topic.id}
                style={[
                  styles.topicRow,
                  index === TOPICS.length - 1 && styles.topicRowLast,
                ]}
                onPress={() => onTopic(topic.id)}
              >
                <View style={styles.topicIcon}>
                  <Icon size={18} color={colors.accent} strokeWidth={2.2} />
                </View>
                <View style={styles.topicCopy}>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <Text style={styles.topicHint}>{topic.hint}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.section}>FAQs</Text>
        {FAQS.map((item) => (
          <FaqItem
            key={item.id}
            item={item}
            open={openId === item.id}
            onToggle={() => setOpenId((cur) => (cur === item.id ? null : item.id))}
          />
        ))}

        <Pressable style={[styles.callCard, shadows.soft]} onPress={onCallDemo}>
          <View style={styles.topicIcon}>
            <Phone size={18} color={colors.accent} strokeWidth={2.2} />
          </View>
          <View style={styles.topicCopy}>
            <Text style={styles.topicTitle}>Call support (demo)</Text>
            <Text style={styles.topicHint}>Explains that this isn’t a real hotline</Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  curve: {
    height: 14,
    backgroundColor: colors.background,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  hero: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xxl,
    marginBottom: spacing.lg,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    marginTop: spacing.md,
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
  },
  heroText: {
    marginTop: spacing.sm,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    textAlign: "center",
  },
  section: {
    marginBottom: spacing.md,
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  topicCard: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  topicRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topicRowLast: {
    borderBottomWidth: 0,
  },
  topicIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  topicCopy: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  topicHint: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "500",
  },
  faqCard: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  faqHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  faqQ: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  faqA: {
    marginTop: spacing.md,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  callCard: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
});
