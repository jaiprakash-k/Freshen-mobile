/**
 * Analytics Screen
 */

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { analyticsApi } from '../../api';
import { Card, LoadingSpinner } from '../../components/common';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

export default function AnalyticsScreen() {
    const [summary, setSummary] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [summaryRes, achievementsRes] = await Promise.all([
                analyticsApi.getSummary({ period: '30d' }),
                analyticsApi.getAchievements(),
            ]);
            setSummary(summaryRes?.data || null);
            // Ensure achievements is always an array
            const achievementsData = achievementsRes?.data;
            setAchievements(Array.isArray(achievementsData) ? achievementsData : []);
        } catch (error) {
            console.error('Failed to load analytics:', error);
            setAchievements([]);
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Impact Summary */}
                <Text style={styles.sectionTitle}>Your Impact</Text>
                <View style={styles.statsGrid}>
                    <Card style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: `${colors.primary}20` }]}>
                            <Ionicons name="leaf" size={24} color={colors.primary} />
                        </View>
                        <Text style={styles.statValue}>{summary?.items_saved || 0}</Text>
                        <Text style={styles.statLabel}>Items Saved</Text>
                    </Card>

                    <Card style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: `${colors.secondary}20` }]}>
                            <Ionicons name="cash" size={24} color={colors.secondary} />
                        </View>
                        <Text style={styles.statValue}>₹{summary?.money_saved || 0}</Text>
                        <Text style={styles.statLabel}>Money Saved</Text>
                    </Card>

                    <Card style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: `${colors.warning}20` }]}>
                            <Ionicons name="cloud" size={24} color={colors.warning} />
                        </View>
                        <Text style={styles.statValue}>{summary?.co2_prevented_kg || 0} kg</Text>
                        <Text style={styles.statLabel}>CO₂ Prevented</Text>
                    </Card>

                    <Card style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: `${colors.secondary}20` }]}>
                            <Ionicons name="water" size={24} color={colors.secondary} />
                        </View>
                        <Text style={styles.statValue}>{summary?.water_saved_liters || 0} L</Text>
                        <Text style={styles.statLabel}>Water Saved</Text>
                    </Card>
                </View>

                {/* Waste Summary */}
                <Card style={styles.wasteCard}>
                    <View style={styles.wasteHeader}>
                        <Ionicons name="warning-outline" size={24} color={colors.danger} />
                        <Text style={styles.wasteTitle}>Food Waste</Text>
                    </View>
                    <View style={styles.wasteStats}>
                        <View style={styles.wasteStat}>
                            <Text style={styles.wasteValue}>{summary?.waste_count || 0}</Text>
                            <Text style={styles.wasteLabel}>Items wasted</Text>
                        </View>
                        <View style={styles.wasteStat}>
                            <Text style={styles.wasteValue}>₹{summary?.waste_cost || 0}</Text>
                            <Text style={styles.wasteLabel}>Cost</Text>
                        </View>
                    </View>
                </Card>

                {/* Achievements */}
                <Text style={styles.sectionTitle}>Achievements</Text>
                <View style={styles.achievementsGrid}>
                    {achievements.map((achievement) => (
                        <Card
                            key={achievement.id}
                            style={[styles.achievementCard, achievement.unlocked && styles.achievementUnlocked]}
                        >
                            <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                            <Text style={styles.achievementName}>{achievement.name}</Text>
                            <Text style={styles.achievementDesc}>{achievement.description}</Text>
                        </Card>
                    ))}
                    {achievements.length === 0 && (
                        <Card style={styles.emptyCard}>
                            <Text style={styles.emptyText}>Keep tracking to unlock achievements!</Text>
                        </Card>
                    )}
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
        padding: spacing.base,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.base,
        marginTop: spacing.base,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    statCard: {
        width: '48%',
        padding: spacing.base,
        alignItems: 'center',
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    wasteCard: {
        marginTop: spacing.base,
        padding: spacing.base,
    },
    wasteHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.base,
    },
    wasteTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    wasteStats: {
        flexDirection: 'row',
        gap: spacing.xl,
    },
    wasteStat: {
        flex: 1,
    },
    wasteValue: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.danger,
    },
    wasteLabel: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 2,
    },
    achievementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    achievementCard: {
        width: '31%',
        padding: spacing.sm,
        alignItems: 'center',
        opacity: 0.5,
    },
    achievementUnlocked: {
        opacity: 1,
        borderColor: colors.primary,
        borderWidth: 1,
    },
    achievementIcon: {
        fontSize: 24,
        marginBottom: spacing.xs,
    },
    achievementName: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.text,
        textAlign: 'center',
    },
    achievementDesc: {
        fontSize: 9,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: 2,
    },
    emptyCard: {
        width: '100%',
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: colors.textMuted,
    },
});
