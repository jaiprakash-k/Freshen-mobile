/**
 * Card Component
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/colors';
import { spacing, borderRadius, shadows } from '../../styles/spacing';

export default function Card({
    children,
    onPress,
    style,
    variant = 'default', // default, elevated
    padding = 'md', // none, sm, md, lg
}) {
    const cardStyles = [
        styles.base,
        styles[variant],
        styles[`padding_${padding}`],
        style,
    ];

    if (onPress) {
        return (
            <TouchableOpacity style={cardStyles} onPress={onPress} activeOpacity={0.7}>
                {children}
            </TouchableOpacity>
        );
    }

    return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
    base: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },

    // Variants
    default: {
        borderWidth: 1,
        borderColor: colors.border,
    },
    elevated: {
        ...shadows.md,
        borderWidth: 0,
    },

    // Padding
    padding_none: {
        padding: 0,
    },
    padding_sm: {
        padding: spacing.sm,
    },
    padding_md: {
        padding: spacing.base,
    },
    padding_lg: {
        padding: spacing.xl,
    },
});
