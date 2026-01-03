/**
 * Family Screen
 */

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Alert,
    Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { familyApi } from '../../api';
import { Button, Card, Input, LoadingSpinner } from '../../components/common';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

export default function FamilyScreen() {
    const [family, setFamily] = useState(null);
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [joinCode, setJoinCode] = useState('');
    const [familyName, setFamilyName] = useState('');

    useEffect(() => {
        loadFamily();
    }, []);

    const loadFamily = async () => {
        try {
            const response = await familyApi.getFamilyMembers();
            if (response.data) {
                setFamily(response.data.family);
                setMembers(response.data.members || []);
            }
        } catch (error) {
            console.log('No family yet');
        }
        setIsLoading(false);
    };

    const handleCreateFamily = async () => {
        if (!familyName.trim()) {
            Alert.alert('Error', 'Please enter a family name');
            return;
        }
        try {
            await familyApi.createFamily({ name: familyName.trim() });
            loadFamily();
        } catch (error) {
            Alert.alert('Error', 'Failed to create family');
        }
    };

    const handleJoinFamily = async () => {
        if (!joinCode.trim()) {
            Alert.alert('Error', 'Please enter an invite code');
            return;
        }
        try {
            await familyApi.joinFamily({ invite_code: joinCode.trim() });
            loadFamily();
        } catch (error) {
            Alert.alert('Error', 'Invalid invite code');
        }
    };

    const handleShare = async () => {
        if (family?.invite_code) {
            await Share.share({
                message: `Join my Freshen family! Use code: ${family.invite_code}`,
            });
        }
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen />;
    }

    if (!family) {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.emptyState}>
                        <Ionicons name="people" size={64} color={colors.textMuted} />
                        <Text style={styles.emptyTitle}>No Family Group</Text>
                        <Text style={styles.emptyText}>
                            Create a family group or join an existing one to share your inventory
                        </Text>
                    </View>

                    <Card style={styles.actionCard}>
                        <Text style={styles.cardTitle}>Create New Family</Text>
                        <Input
                            placeholder="Family name"
                            value={familyName}
                            onChangeText={setFamilyName}
                        />
                        <Button title="Create Family" onPress={handleCreateFamily} />
                    </Card>

                    <Card style={styles.actionCard}>
                        <Text style={styles.cardTitle}>Join Existing Family</Text>
                        <Input
                            placeholder="Invite code"
                            value={joinCode}
                            onChangeText={setJoinCode}
                            autoCapitalize="characters"
                        />
                        <Button title="Join Family" onPress={handleJoinFamily} variant="outline" />
                    </Card>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Family Info */}
                <Card style={styles.familyCard}>
                    <View style={styles.familyHeader}>
                        <Text style={styles.familyName}>{family.name}</Text>
                        <TouchableOpacity onPress={handleShare}>
                            <Ionicons name="share-outline" size={24} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inviteCodeContainer}>
                        <Text style={styles.inviteLabel}>Invite Code:</Text>
                        <Text style={styles.inviteCode}>{family.invite_code}</Text>
                    </View>
                </Card>

                {/* Members */}
                <Text style={styles.sectionTitle}>Members</Text>
                {members.map((member) => (
                    <Card key={member.id} style={styles.memberCard}>
                        <View style={styles.memberAvatar}>
                            <Text style={styles.memberAvatarText}>
                                {member.name?.charAt(0)?.toUpperCase() || '?'}
                            </Text>
                        </View>
                        <View style={styles.memberInfo}>
                            <Text style={styles.memberName}>{member.name}</Text>
                            <Text style={styles.memberRole}>{member.role}</Text>
                        </View>
                    </Card>
                ))}
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
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacing['2xl'],
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text,
        marginTop: spacing.base,
    },
    emptyText: {
        fontSize: 14,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: spacing.sm,
        paddingHorizontal: spacing.xl,
    },
    actionCard: {
        padding: spacing.base,
        marginBottom: spacing.base,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.base,
    },
    familyCard: {
        padding: spacing.base,
        marginBottom: spacing.xl,
    },
    familyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.base,
    },
    familyName: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text,
    },
    inviteCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceLight,
        padding: spacing.sm,
        borderRadius: borderRadius.md,
    },
    inviteLabel: {
        fontSize: 14,
        color: colors.textMuted,
        marginRight: spacing.sm,
    },
    inviteCode: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.primary,
        letterSpacing: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.base,
    },
    memberCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.base,
        marginBottom: spacing.sm,
    },
    memberAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.base,
    },
    memberAvatarText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.white,
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
    },
    memberRole: {
        fontSize: 13,
        color: colors.textMuted,
        textTransform: 'capitalize',
    },
});
