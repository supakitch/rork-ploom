import { Tabs } from "expo-router";
import { Home, Heart, Clock, Settings, Plus } from "lucide-react-native";
import React from "react";
import { View, Pressable, Platform } from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";

const TabColors = {
  home: '#6B3FA0',
  favorites: '#E91E63',
  history: '#FF9800',
  settings: '#4CAF50',
  inactive: '#999999',
} as const;

function CustomTabButton() {
  return (
    <View style={{
      position: 'absolute',
      top: -30,
      left: '50%',
      marginLeft: -30,
      width: 60,
      height: 60,
      borderRadius: 30,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 8,
    }}>
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#FF6FD8',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 3,
          borderColor: '#3813C2',
        }}
      >
        <Pressable
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => router.push('/story-creation')}
        >
          <Plus color="#FFFFFF" size={28} />
        </Pressable>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: TabColors.inactive,
          tabBarInactiveTintColor: TabColors.inactive,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,
            paddingBottom: Platform.OS === 'ios' ? 20 : 10,
            paddingTop: 8,
            height: Platform.OS === 'ios' ? 80 : 60,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "",
            tabBarActiveTintColor: TabColors.home,
            tabBarIcon: ({ color, size }) => <Home color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: "",
            tabBarActiveTintColor: TabColors.favorites,
            tabBarIcon: ({ color, size }) => <Heart color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: "",
            tabBarButton: () => <CustomTabButton />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: "",
            tabBarActiveTintColor: TabColors.history,
            tabBarIcon: ({ color, size }) => <Clock color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "",
            tabBarActiveTintColor: TabColors.settings,
            tabBarIcon: ({ color, size }) => <Settings color={color} size={24} />,
          }}
        />
      </Tabs>
    </View>
  );
}