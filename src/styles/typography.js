/**
 * FreshKeep Design System - Typography
 */

export const typography = {
    // Font sizes
    sizes: {
        xs: 10,
        sm: 12,
        md: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
    },

    // Font weights
    weights: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },

    // Line heights
    lineHeights: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },
};

// Pre-defined text styles
export const textStyles = {
    h1: {
        fontSize: typography.sizes['3xl'],
        fontWeight: typography.weights.bold,
    },
    h2: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.weights.bold,
    },
    h3: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.semibold,
    },
    body: {
        fontSize: typography.sizes.base,
        fontWeight: typography.weights.regular,
    },
    bodySmall: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.regular,
    },
    caption: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.regular,
    },
    label: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
};

export default typography;
