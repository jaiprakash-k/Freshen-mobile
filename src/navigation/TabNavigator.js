/**
 * Tab Navigator
 * Bottom tab navigation for main app screens
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import InventoryScreen from '../screens/inventory/InventoryScreen';
import ItemDetailScreen from '../screens/inventory/ItemDetailScreen';
import AddItemScreen from '../screens/inventory/AddItemScreen';
import ScanReceiptScreen from '../screens/inventory/ScanReceiptScreen';
import ScanBarcodeScreen from '../screens/inventory/ScanBarcodeScreen';
import RecipesScreen from '../screens/recipes/RecipesScreen';
import RecipeDetailScreen from '../screens/recipes/RecipeDetailScreen';
import ShoppingListScreen from '../screens/shopping/ShoppingListScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import AnalyticsScreen from '../screens/analytics/AnalyticsScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import FamilyScreen from '../screens/family/FamilyScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack for Inventory tab
function InventoryStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.text,
                headerTitleStyle: { fontWeight: '600' },
                contentStyle: { backgroundColor: colors.background },
            }}
        >
            <Stack.Screen
                name="InventoryList"
                component={InventoryScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ItemDetail"
                component={ItemDetailScreen}
                options={{ title: 'Item Details' }}
            />
            <Stack.Screen
                name="AddItem"
                component={AddItemScreen}
                options={{ title: 'Add Item' }}
            />
            <Stack.Screen
                name="ScanReceipt"
                component={ScanReceiptScreen}
                options={{ title: 'Scan Receipt' }}
            />
            <Stack.Screen
                name="ScanBarcode"
                component={ScanBarcodeScreen}
                options={{ title: 'Scan Barcode' }}
            />
        </Stack.Navigator>
    );
}

// Stack for Recipes tab
function RecipesStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.text,
                contentStyle: { backgroundColor: colors.background },
            }}
        >
            <Stack.Screen
                name="RecipesList"
                component={RecipesScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="RecipeDetail"
                component={RecipeDetailScreen}
                options={{ title: 'Recipe' }}
            />
        </Stack.Navigator>
    );
}

// Stack for Settings/Profile tab
function ProfileStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.text,
                contentStyle: { backgroundColor: colors.background },
            }}
        >
            <Stack.Screen
                name="SettingsMain"
                component={SettingsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Analytics"
                component={AnalyticsScreen}
                options={{ title: 'Analytics' }}
            />
            <Stack.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{ title: 'Notifications' }}
            />
            <Stack.Screen
                name="Family"
                component={FamilyScreen}
                options={{ title: 'Family Sharing' }}
            />
        </Stack.Navigator>
    );
}

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Inventory':
                            iconName = focused ? 'cube' : 'cube-outline';
                            break;
                        case 'Recipes':
                            iconName = focused ? 'restaurant' : 'restaurant-outline';
                            break;
                        case 'Shopping':
                            iconName = focused ? 'cart' : 'cart-outline';
                            break;
                        case 'Profile':
                            iconName = focused ? 'person' : 'person-outline';
                            break;
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    height: 85,
                    paddingTop: 8,
                    paddingBottom: 25,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '500',
                },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Inventory" component={InventoryStack} />
            <Tab.Screen name="Recipes" component={RecipesStack} />
            <Tab.Screen name="Shopping" component={ShoppingListScreen} />
            <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
    );
}
