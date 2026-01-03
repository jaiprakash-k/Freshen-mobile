/**
 * Settings Screen  
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

export default function SettingsScreen({ navigation }) {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: logout },
        ]);
    };

    const MenuItem = ({ icon, label, onPress, rightText, danger }) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
                <Ionicons name={icon} size={20} color={danger ? colors.danger : colors.textMuted} />
            </View>
            <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
            {rightText && <Text style={styles.menuRight}>{rightText}</Text>}
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Profile Header */}
                <View style={styles.header}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <Text style={styles.userName}>{user?.name || 'User'}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                </View>

                {/* Quick Stats Navigation */}
                <View style={styles.quickLinks}>
                    <TouchableOpacity
                        style={styles.quickLink}
                        onPress={() => navigation.navigate('Analytics')}
                    >
                        <Ionicons name="stats-chart" size={24} color={colors.primary} />
                        <Text style={styles.quickLinkLabel}>Analytics</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.quickLink}
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <Ionicons name="notifications" size={24} color={colors.secondary} />
                        <Text style={styles.quickLinkLabel}>Notifications</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.quickLink}
                        onPress={() => navigation.navigate('Family')}
                    >
                        <Ionicons name="people" size={24} color={colors.warning} />
                        <Text style={styles.quickLinkLabel}>Family</Text>
                    </TouchableOpacity>
                </View>

                {/* Settings Menu */}
                <Card style={styles.menuCard}>
                    <MenuItem icon="person-outline" label="Edit Profile" onPress={() => { }} />
                    <MenuItem icon="notifications-outline" label="Notification Settings" onPress={() => { }} />
                    <MenuItem icon="nutrition-outline" label="Dietary Preferences" onPress={() => { }} />
                    <MenuItem icon="time-outline" label="Expiration Settings" onPress={() => { }} />
                </Card>

                <Card style={styles.menuCard}>
                    <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => { }} />
                    <MenuItem icon="document-text-outline" label="Privacy Policy" onPress={() => { }} />
                    <MenuItem icon="information-circle-outline" label="About" rightText="v1.0.0" onPress={() => { }} />
                </Card>

                <Card style={styles.menuCard}>
                    <MenuItem icon="log-out-outline" label="Logout" onPress={handleLogout} danger />
                </Card>

                <Text style={styles.version}>Freshen v1.0.0</Text>
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
    header: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.base,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.white,
    },
    userName: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text,
    },
    userEmail: {
        fontSize: 14,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    quickLinks: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: spacing.xl,
    },
    quickLink: {
        alignItems: 'center',
        backgroundColor: colors.surface,
        paddingVertical: spacing.base,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.lg,
        gap: spacing.xs,
    },
    quickLinkLabel: {
        fontSize: 12,
        color: colors.textMuted,
        fontWeight: '500',
    },
    menuCard: {
        marginBottom: spacing.base,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.base,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    menuIcon: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.md,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    menuIconDanger: {
        backgroundColor: `${colors.danger}15`,
    },
    menuLabel: {
        flex: 1,
        fontSize: 15,
        color: colors.text,
        fontWeight: '500',
    },
    menuLabelDanger: {
        color: colors.danger,
    },
    menuRight: {
        fontSize: 14,
        color: colors.textMuted,
        marginRight: spacing.sm,
    },
    version: {
        textAlign: 'center',
        fontSize: 12,
        color: colors.textMuted,
        marginTop: spacing.xl,
    },
});
