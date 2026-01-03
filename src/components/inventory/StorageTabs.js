/**
 * Storage Tabs Component
 * Tabs for filtering by storage location
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

const STORAGE_OPTIONS = [
    { id: 'all', label: 'All', icon: 'grid-outline' },
    { id: 'fridge', label: 'Fridge', icon: 'snow-outline' },
    { id: 'freezer', label: 'Freezer', icon: 'cube-outline' },
    { id: 'pantry', label: 'Pantry', icon: 'file-tray-stacked-outline' },
];

export default function StorageTabs({ activeStorage, onStorageChange }) {
    return (
        <View style={styles.container}>
            {STORAGE_OPTIONS.map((option) => {
                const isActive = activeStorage === option.id;
                return (
                    <TouchableOpacity
                        key={option.id}
                        style={[styles.tab, isActive && styles.activeTab]}
                        onPress={() => onStorageChange(option.id)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={option.icon}
                            size={18}
                            color={isActive ? colors.primary : colors.textMuted}
                        />
                        <Text style={[styles.label, isActive && styles.activeLabel]}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        padding: spacing.xs,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
        borderRadius: borderRadius.lg,
        gap: spacing.xs,
    },
    activeTab: {
        backgroundColor: colors.surfaceLight,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.textMuted,
    },
    activeLabel: {
        color: colors.primary,
    },
});
