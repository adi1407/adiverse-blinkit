import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as NativeSplash from "expo-splash-screen";
import { CartProvider, useCart } from "./src/context/CartContext";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { AddressProvider, useAddress } from "./src/context/AddressContext";
import AnimatedSplash from "./src/components/AnimatedSplash";
import AppNavigator from "./src/navigation/AppNavigator";
import { colors } from "./src/theme/colors";

NativeSplash.preventAutoHideAsync().catch(() => {});

function Root() {
  const { ready: authReady } = useAuth();
  const { ready: addressReady } = useAddress();
  const { ready: cartReady } = useCart();
  const ready = authReady && addressReady && cartReady;

  return (
    <AnimatedSplash ready={ready}>
      {ready ? (
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      ) : (
        <View style={styles.boot} />
      )}
    </AnimatedSplash>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <AddressProvider>
          <CartProvider>
            <Root />
          </CartProvider>
        </AddressProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: colors.primary,
  },
});
