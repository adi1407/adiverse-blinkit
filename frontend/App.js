import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { CartProvider } from "./src/context/CartContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <AppNavigator />
      </NavigationContainer>
    </CartProvider>
  );
}
