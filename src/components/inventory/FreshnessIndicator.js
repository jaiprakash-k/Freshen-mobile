/**
 * Freshness Indicator Component
 * Shows visual freshness status of items
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * Get freshness color based on days until expiry
 */
export const getFreshnessColor = (days) => {
    if (days === null || days === undefined) return colors.textMuted;
    if (days < 0) return colors.expired;
    if (days === 0) return colors.expiresToday;
    if (days <= 3) return colors.expiringSoon;
    return colors.fresh;
};

/**
 * Get freshness label
 */
export const getFreshnessLabel = (days) => {
    if (days === null || days === undefined) return 'No date';
    if (days < 0) return 'Expired';
    if (days === 0) return 'Today';
    if (days === 1) return '1 day';
    return `${days} days`;
};

export default function FreshnessIndicator({ daysUntilExpiry, size = 'md', showDot = true }) {
    const color = getFreshnessColor(daysUntilExpiry);
    const label = getFreshnessLabel(daysUntilExpiry);

    const sizes = {
        sm: { dotSize: 8, fontSize: 10 },
        md: { dotSize: 10, fontSize: 12 },
        lg: { dotSize: 12, fontSize: 14 },
    };

    const { dotSize, fontSize } = sizes[size];

    return (
        <View style={styles.container}>
            {showDot && (
                <View
                    style={[
                        styles.dot,
                        { width: dotSize, height: dotSize, backgroundColor: color },
                    ]}
                />
            )}
            <Text style={[styles.label, { color, fontSize }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    dot: {
        borderRadius: borderRadius.full,
    },
    label: {
        fontWeight: '500',
    },
});
