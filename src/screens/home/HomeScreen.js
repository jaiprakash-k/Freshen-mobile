/**
 * Home Screen
 * Dashboard with quick stats and expiring items
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Card, LoadingSpinner } from '../../components/common';
import { ItemCard } from '../../components/inventory';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

export default function HomeScreen({ navigation }) {
    const { user } = useAuth();
    const { expiringItems, stats, fetchExpiringItems, fetchStats, isLoading } = useApp();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        await Promise.all([fetchExpiringItems(3), fetchStats()]);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, []);

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>{greeting()}</Text>
                        <Text style={styles.userName}>{user?.name || 'User'} 👋</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.notificationButton}
                        onPress={() => navigation.navigate('Profile', { screen: 'Notifications' })}
                    >
                        <Ionicons name="notifications-outline" size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Inventory')}>
                        <Card style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: `${colors.primary}20` }]}>
                                <Ionicons name="cube" size={24} color={colors.primary} />
                            </View>
                            <Text style={styles.statValue}>{stats?.total_items || 0}</Text>
                            <Text style={styles.statLabel}>Total Items</Text>
                        </Card>
                    </TouchableOpacity>

                    <Card style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: `${colors.warning}20` }]}>
                            <Ionicons name="time" size={24} color={colors.warning} />
                        </View>
                        <Text style={styles.statValue}>{stats?.expiring_soon || expiringItems.length}</Text>
                        <Text style={styles.statLabel}>Expiring Soon</Text>
                    </Card>

                    <Card style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: `${colors.secondary}20` }]}>
                            <Ionicons name="cash" size={24} color={colors.secondary} />
                        </View>
                        <Text style={styles.statValue}>₹{stats?.money_saved || 0}</Text>
                        <Text style={styles.statLabel}>Saved</Text>
                    </Card>
                </View>

                {/* Quick Actions */}
                <Card style={styles.quickActions}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsRow}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('Inventory', { screen: 'AddItem' })}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: `${colors.primary}20` }]}>
                                <Ionicons name="add" size={24} color={colors.primary} />
                            </View>
                            <Text style={styles.actionLabel}>Add Item</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('Inventory', { screen: 'ScanReceipt' })}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: `${colors.secondary}20` }]}>
                                <Ionicons name="camera" size={24} color={colors.secondary} />
                            </View>
                            <Text style={styles.actionLabel}>Scan Receipt</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('Inventory', { screen: 'ScanBarcode' })}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: `${colors.warning}20` }]}>
                                <Ionicons name="barcode" size={24} color={colors.warning} />
                            </View>
                            <Text style={styles.actionLabel}>Scan Barcode</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('Recipes')}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: `${colors.danger}20` }]}>
                                <Ionicons name="restaurant" size={24} color={colors.danger} />
                            </View>
                            <Text style={styles.actionLabel}>Recipes</Text>
                        </TouchableOpacity>
                    </View>
                </Card>

                {/* Expiring Soon */}
                <View style={styles.expiringSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>⚠️ Expiring Soon</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Inventory')}>
                            <Text style={styles.viewAll}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <LoadingSpinner />
                    ) : expiringItems.length > 0 ? (
                        expiringItems.slice(0, 5).map((item) => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                onPress={() => navigation.navigate('Inventory', { screen: 'ItemDetail', params: { item } })}
                            />
                        ))
                    ) : (
                        <Card style={styles.emptyCard}>
                            <Ionicons name="checkmark-circle" size={48} color={colors.primary} />
                            <Text style={styles.emptyText}>No items expiring soon</Text>
                            <Text style={styles.emptySubtext}>Great job managing your inventory!</Text>
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
    scrollView: {
        flex: 1,
    },
    content: {
        padding: spacing.base,
        paddingBottom: spacing['3xl'],
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    greeting: {
        fontSize: 14,
        color: colors.textMuted,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
    },
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.xl,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: spacing.base,
    },
    statIcon: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
    },
    statLabel: {
        fontSize: 11,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    quickActions: {
        padding: spacing.base,
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.base,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        alignItems: 'center',
        flex: 1,
    },
    actionIcon: {
        width: 52,
        height: 52,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    actionLabel: {
        fontSize: 11,
        color: colors.textMuted,
        textAlign: 'center',
    },
    expiringSection: {
        marginBottom: spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.base,
    },
    viewAll: {
        fontSize: 14,
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
    },
});
