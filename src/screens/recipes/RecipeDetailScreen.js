/**
 * Recipe Detail Screen
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { recipeApi } from '../../api';
import { Card, LoadingSpinner } from '../../components/common';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

export default function RecipeDetailScreen({ route }) {
    const { recipe } = route.params;
    const [details, setDetails] = useState(recipe);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (recipe.id) {
            loadDetails();
        }
    }, []);

    const loadDetails = async () => {
        setIsLoading(true);
        try {
            const response = await recipeApi.getRecipeDetail(recipe.id);
            if (response.data) {
                setDetails(response.data);
            }
        } catch (error) {
            console.error('Failed to load recipe details:', error);
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Image
                    source={{ uri: details.image || 'https://via.placeholder.com/400x300' }}
                    style={styles.image}
                />

                <View style={styles.body}>
                    <Text style={styles.title}>{details.title}</Text>

                    <View style={styles.stats}>
                        <View style={styles.statItem}>
                            <Ionicons name="time-outline" size={20} color={colors.primary} />
                            <Text style={styles.statValue}>{details.readyInMinutes || 30} min</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="people-outline" size={20} color={colors.primary} />
                            <Text style={styles.statValue}>{details.servings || 4}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="flame-outline" size={20} color={colors.primary} />
                            <Text style={styles.statValue}>{details.calories || 'N/A'} cal</Text>
                        </View>
                    </View>

                    {/* Ingredients */}
                    <Card style={styles.section}>
                        <Text style={styles.sectionTitle}>Ingredients</Text>
                        {details.extendedIngredients?.map((ing, index) => (
                            <View key={index} style={styles.ingredientRow}>
                                <View style={styles.bullet} />
                                <Text style={styles.ingredientText}>{ing.original}</Text>
                            </View>
                        )) || (
                                <Text style={styles.placeholder}>Ingredients not available</Text>
                            )}
                    </Card>

                    {/* Instructions */}
                    <Card style={styles.section}>
                        <Text style={styles.sectionTitle}>Instructions</Text>
                        {details.instructions ? (
                            <Text style={styles.instructions}>{details.instructions.replace(/<[^>]*>/g, '\n')}</Text>
                        ) : details.analyzedInstructions?.[0]?.steps?.map((step, index) => (
                            <View key={index} style={styles.stepRow}>
                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>{step.number}</Text>
                                </View>
                                <Text style={styles.stepText}>{step.step}</Text>
                            </View>
                        )) || (
                            <Text style={styles.placeholder}>Instructions not available</Text>
                        )}
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingBottom: spacing['2xl'],
    },
    image: {
        width: '100%',
        height: 250,
        backgroundColor: colors.surfaceLight,
    },
    body: {
        padding: spacing.base,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
        marginBottom: spacing.base,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: spacing.xl,
        paddingVertical: spacing.base,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
    },
    statItem: {
        alignItems: 'center',
        gap: spacing.xs,
    },
    statValue: {
        fontSize: 14,
        color: colors.text,
        fontWeight: '500',
    },
    section: {
        padding: spacing.base,
        marginBottom: spacing.base,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.base,
    },
    ingredientRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.primary,
        marginTop: 6,
        marginRight: spacing.sm,
    },
    ingredientText: {
        flex: 1,
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.base,
    },
    stepNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    stepNumberText: {
        fontSize: 12,
        color: colors.white,
        fontWeight: '600',
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    instructions: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 22,
    },
    placeholder: {
        fontSize: 14,
        color: colors.textMuted,
        fontStyle: 'italic',
    },
});
