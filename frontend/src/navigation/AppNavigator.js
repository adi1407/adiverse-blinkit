import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import CartScreen from "../screens/CartScreen";
import AccountScreen from "../screens/AccountScreen";
import CategoryProductsScreen from "../screens/CategoryProductsScreen";
import OrderAgainScreen from "../screens/OrderAgainScreen";
import PrintScreen from "../screens/PrintScreen";
import BlinkitTabBar from "../components/BlinkitTabBar";
import FloatingCartBar from "../components/FloatingCartBar";
import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <View style={styles.tabsRoot}>
      <Tab.Navigator
        tabBar={(props) => <BlinkitTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen
          name="OrderAgain"
          component={OrderAgainScreen}
          options={{ title: "Order Again" }}
        />
        <Tab.Screen name="Categories" component={CategoriesScreen} />
        <Tab.Screen name="Print" component={PrintScreen} />
      </Tab.Navigator>
      <FloatingCartBar />
    </View>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabsRoot: {
    flex: 1,
  },
});
