import { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  FlatList,
  Pressable,
  Alert,
  RefreshControl,
} from "react-native";
import { Printer, RefreshCw, ChevronLeft } from "../utils/lucideIcons";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { useAuth } from "../context/AuthContext";
import { cancelPrintJob, fetchPrintJobs } from "../api/printApi";
import { colors, spacing, radii, shadows } from "../theme/colors";

const STATUS_LABEL = {
  confirmed: "Confirmed",
  printing: "Printing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function formatWhen(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function PrintJobsScreen({ navigation }) {
  const { user, isLoggedIn } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!isLoggedIn || !user?.phone) {
      setJobs([]);
      setLoading(false);
      return;
    }

    setError("");
    try {
      const data = await fetchPrintJobs(user.phone);
      setJobs(data.jobs || []);
    } catch (err) {
      setError(err.message || "Failed to load print jobs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isLoggedIn, user?.phone]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  function onCancel(job) {
    Alert.alert("Cancel print job?", "You can cancel only before printing starts.", [
      { text: "Keep", style: "cancel" },
      {
        text: "Cancel job",
        style: "destructive",
        onPress: async () => {
          try {
            await cancelPrintJob({ jobId: job.id, phone: user.phone });
            load();
          } catch (err) {
            Alert.alert("Cancel failed", err.message || "Try again");
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}>
          <ChevronLeft size={24} color={colors.text} strokeWidth={2.4} />
        </Pressable>
        <Text style={styles.title}>Print jobs</Text>
        <Pressable onPress={load} style={styles.back} hitSlop={8}>
          <RefreshCw size={18} color={colors.text} strokeWidth={2.2} />
        </Pressable>
      </View>
      <View style={styles.curve} />

      {!isLoggedIn ? (
        <View style={styles.body}>
          <Text style={styles.emptyTitle}>Login to see print jobs</Text>
          <Pressable style={styles.loginBtn} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>Login</Text>
          </Pressable>
        </View>
      ) : loading ? (
        <LoadingState label="Loading print jobs…" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => {
              setRefreshing(true);
              load();
            }} />
          }
          ListEmptyComponent={
            <View style={[styles.emptyBox, shadows.soft]}>
              <Printer size={28} color={colors.accent} />
              <Text style={styles.emptyTitle}>No print jobs yet</Text>
              <Text style={styles.emptyText}>
                Upload a document or photo from the Print tab.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.card, shadows.soft]}>
              <View style={styles.cardTop}>
                <Text style={styles.jobId}>{item.id}</Text>
                <View
                  style={[
                    styles.badge,
                    item.status === "cancelled" && styles.badgeCancel,
                    item.status === "delivered" && styles.badgeDone,
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {STATUS_LABEL[item.status] || item.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.meta}>
                {item.kind === "photo" ? "Photos" : "Documents"} · {item.files?.length || 0}{" "}
                file{(item.files?.length || 0) === 1 ? "" : "s"} · {item.copies}×
              </Text>
              <Text style={styles.when}>{formatWhen(item.createdAt)}</Text>
              <View style={styles.cardBottom}>
                <Text style={styles.total}>₹{item.grandTotal}</Text>
                {item.canCancel ? (
                  <Pressable onPress={() => onCancel(item)}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  back: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
  },
  curve: {
    height: 14,
    backgroundColor: colors.background,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  body: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  list: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  emptyBox: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 40,
  },
  emptyTitle: {
    marginTop: spacing.md,
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
  },
  emptyText: {
    marginTop: spacing.sm,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
  },
  loginBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
    borderRadius: radii.md,
  },
  loginText: {
    color: colors.white,
    fontWeight: "900",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  jobId: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
  },
  badge: {
    backgroundColor: colors.accentSoft,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeCancel: {
    backgroundColor: "#FDECEC",
  },
  badgeDone: {
    backgroundColor: "#E8F5E9",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.text,
  },
  meta: {
    marginTop: spacing.sm,
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  when: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
  },
  cardBottom: {
    marginTop: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  total: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
  },
  cancelText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.danger,
  },
});
