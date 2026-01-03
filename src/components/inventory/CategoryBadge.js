/**
 * Category Badge Component
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

// Category configurations
const CATEGORIES = {
    dairy: { icon: 'water-outline', color: '#60A5FA', label: 'Dairy' },
    meat: { icon: 'restaurant-outline', color: '#F87171', label: 'Meat' },
    poultry: { icon: 'egg-outline', color: '#FBBF24', label: 'Poultry' },
    fish: { icon: 'fish-outline', color: '#38BDF8', label: 'Fish' },
    vegetables: { icon: 'leaf-outline', color: '#4ADE80', label: 'Vegetables' },
    fruits: { icon: 'nutrition-outline', color: '#FB923C', label: 'Fruits' },
    bread: { icon: 'basket-outline', color: '#C4A574', label: 'Bread' },
    eggs: { icon: 'egg-outline', color: '#FCD34D', label: 'Eggs' },
    frozen: { icon: 'snow-outline', color: '#38BDF8', label: 'Frozen' },
    canned: { icon: 'cube-outline', color: '#94A3B8', label: 'Canned' },
    condiments: { icon: 'flask-outline', color: '#A78BFA', label: 'Condiments' },
    beverages: { icon: 'wine-outline', color: '#34D399', label: 'Beverages' },
    snacks: { icon: 'fast-food-outline', color: '#FBBF24', label: 'Snacks' },
    grains: { icon: 'layers-outline', color: '#D4A574', label: 'Grains' },
    other: { icon: 'ellipse-outline', color: '#94A3B8', label: 'Other' },
};

export default function CategoryBadge({ category, size = 'md', showLabel = true }) {
    const config = CATEGORIES[category?.toLowerCase()] || CATEGORIES.other;

    const sizes = {
        sm: { iconSize: 12, fontSize: 10, padding: spacing.xs },
        md: { iconSize: 14, fontSize: 12, padding: spacing.sm },
        lg: { iconSize: 18, fontSize: 14, padding: spacing.md },
    };

    const { iconSize, fontSize, padding } = sizes[size];

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: `${config.color}20`, paddingHorizontal: padding, paddingVertical: padding / 2 },
            ]}
        >
            <Ionicons name={config.icon} size={iconSize} color={config.color} />
            {showLabel && (
                <Text style={[styles.label, { color: config.color, fontSize }]}>
                    {config.label}
                </Text>
            )}
        </View>
    );
}

export { CATEGORIES };

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: borderRadius.full,
        gap: spacing.xs,
    },
    label: {
        fontWeight: '500',
    },
});
