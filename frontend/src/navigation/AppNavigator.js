import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import CartScreen from "../screens/CartScreen";
import AccountScreen from "../screens/AccountScreen";
import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator();

function tabIcon(name, focused) {
  return (
    <Ionicons
      name={name}
      size={22}
      color={focused ? colors.accent : colors.textMuted}
    />
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            tabIcon(focused ? "home" : "home-outline", focused),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            tabIcon(focused ? "grid" : "grid-outline", focused),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            tabIcon(focused ? "cart" : "cart-outline", focused),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            tabIcon(focused ? "person" : "person-outline", focused),
        }}
      />
    </Tab.Navigator>
  );
}
