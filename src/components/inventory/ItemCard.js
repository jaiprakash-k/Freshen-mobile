/**
 * Item Card Component
 * Premium card for displaying inventory items
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { spacing, borderRadius, shadows } from '../../styles/spacing';
import FreshnessIndicator, { getFreshnessColor } from './FreshnessIndicator';
import CategoryBadge from './CategoryBadge';

export default function ItemCard({ item, onPress, onConsume, onWaste }) {
    const expiryColor = getFreshnessColor(item.days_until_expiry);

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress?.(item)}
            activeOpacity={0.7}
        >
            {/* Left accent bar */}
            <View style={[styles.accentBar, { backgroundColor: expiryColor }]} />

            <View style={styles.content}>
                {/* Main info */}
                <View style={styles.mainInfo}>
                    <View style={styles.header}>
                        <Text style={styles.name} numberOfLines={1}>
                            {item.name}
                        </Text>
                        <FreshnessIndicator daysUntilExpiry={item.days_until_expiry} size="sm" />
                    </View>

                    <View style={styles.details}>
                        <Text style={styles.quantity}>
                            {item.quantity} {item.unit}
                        </Text>
                        <CategoryBadge category={item.category} size="sm" />
                    </View>
                </View>

                {/* Quick actions */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.consumeButton]}
                        onPress={() => onConsume?.(item)}
                    >
                        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.wasteButton]}
                        onPress={() => onWaste?.(item)}
                    >
                        <Ionicons name="trash-outline" size={18} color={colors.danger} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        marginBottom: spacing.sm,
        overflow: 'hidden',
        ...shadows.sm,
    },
    accentBar: {
        width: 4,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.base,
    },
    mainInfo: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    name: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginRight: spacing.sm,
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    quantity: {
        fontSize: 14,
        color: colors.textMuted,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginLeft: spacing.sm,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    consumeButton: {
        backgroundColor: `${colors.primary}15`,
    },
    wasteButton: {
        backgroundColor: `${colors.danger}15`,
    },
});
