/**
 * Recipes Screen
 * Recipe recommendations based on inventory
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    RefreshControl,
    Image,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { recipeApi } from '../../api';
import { Card, LoadingSpinner } from '../../components/common';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

export default function RecipesScreen({ navigation }) {
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadRecipes();
    }, []);

    const loadRecipes = async () => {
        try {
            const response = await recipeApi.getRecipes();
            setRecipes(response.data || []);
        } catch (error) {
            console.error('Failed to load recipes:', error);
        }
        setIsLoading(false);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadRecipes();
        setRefreshing(false);
    }, []);

    const renderRecipeCard = ({ item }) => (
        <TouchableOpacity
            style={styles.recipeCard}
            onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
            activeOpacity={0.7}
        >
            <Image
                source={{ uri: item.image || 'https://via.placeholder.com/300x200' }}
                style={styles.recipeImage}
            />
            <View style={styles.recipeContent}>
                <Text style={styles.recipeName} numberOfLines={2}>{item.title}</Text>
                <View style={styles.recipeInfo}>
                    <View style={styles.recipeInfoItem}>
                        <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                        <Text style={styles.recipeInfoText}>{item.readyInMinutes || 30} min</Text>
                    </View>
                    <View style={styles.recipeInfoItem}>
                        <Ionicons name="people-outline" size={14} color={colors.textMuted} />
                        <Text style={styles.recipeInfoText}>{item.servings || 4} servings</Text>
                    </View>
                </View>
                {item.usedIngredientCount && (
                    <View style={styles.usedBadge}>
                        <Text style={styles.usedBadgeText}>
                            Uses {item.usedIngredientCount} items from inventory
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Finding recipes..." />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Recipe Ideas</Text>
                <Text style={styles.subtitle}>Based on your expiring ingredients</Text>
            </View>

            <FlatList
                data={recipes}
                keyExtractor={(item) => item.id?.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
                renderItem={renderRecipeCard}
                ListEmptyComponent={
                    <Card style={styles.emptyCard}>
                        <Ionicons name="restaurant-outline" size={48} color={colors.textMuted} />
                        <Text style={styles.emptyText}>No recipes found</Text>
                        <Text style={styles.emptySubtext}>
                            Add more items to your inventory to get recipe suggestions
                        </Text>
                    </Card>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: spacing.base,
        paddingBottom: spacing.sm,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    listContent: {
        padding: spacing.base,
        paddingTop: 0,
    },
    recipeCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        marginBottom: spacing.base,
        overflow: 'hidden',
    },
    recipeImage: {
        width: '100%',
        height: 160,
        backgroundColor: colors.surfaceLight,
    },
    recipeContent: {
        padding: spacing.base,
    },
    recipeName: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.sm,
    },
    recipeInfo: {
        flexDirection: 'row',
        gap: spacing.base,
        marginBottom: spacing.sm,
    },
    recipeInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    recipeInfoText: {
        fontSize: 13,
        color: colors.textMuted,
    },
    usedBadge: {
        backgroundColor: `${colors.primary}20`,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        alignSelf: 'flex-start',
    },
    usedBadgeText: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '500',
    },
    emptyCard: {
        alignItems: 'center',
        padding: spacing['2xl'],
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginTop: spacing.base,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.textMuted,
        marginTop: spacing.xs,
        textAlign: 'center',
    },
});
