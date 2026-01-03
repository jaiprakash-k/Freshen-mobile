/**
 * Notifications Screen
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { notificationsApi } from '../../api';
import { Card, LoadingSpinner } from '../../components/common';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const response = await notificationsApi.getNotifications();
            setNotifications(response.data || []);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
        setIsLoading(false);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadNotifications();
        setRefreshing(false);
    }, []);

    const handleDismiss = async (id) => {
        await notificationsApi.dismissNotification(id);
        setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'expiring': return 'warning';
            case 'expired': return 'alert-circle';
            case 'recipe': return 'restaurant';
            case 'achievement': return 'trophy';
            default: return 'notifications';
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'expiring': return colors.warning;
            case 'expired': return colors.danger;
            case 'recipe': return colors.secondary;
            case 'achievement': return colors.primary;
            default: return colors.textMuted;
        }
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.notificationCard, !item.read && styles.unread]}
                        onPress={() => handleDismiss(item.id)}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: `${getColor(item.type)}20` }]}>
                            <Ionicons name={getIcon(item.type)} size={20} color={getColor(item.type)} />
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
                            <Text style={styles.time}>{formatTime(item.created_at)}</Text>
                        </View>
                        {!item.read && <View style={styles.unreadDot} />}
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Card style={styles.emptyCard}>
                        <Ionicons name="notifications-off-outline" size={48} color={colors.textMuted} />
                        <Text style={styles.emptyText}>No notifications</Text>
                        <Text style={styles.emptySubtext}>You're all caught up!</Text>
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
    listContent: {
        padding: spacing.base,
    },
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.base,
        marginBottom: spacing.sm,
    },
    unread: {
        backgroundColor: colors.surfaceLight,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 2,
    },
    body: {
        fontSize: 13,
        color: colors.textMuted,
        lineHeight: 18,
    },
    time: {
        fontSize: 11,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
        marginLeft: spacing.sm,
        marginTop: 4,
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
