/**
 * Item Detail Screen
 */

import React, { useState } from 'react';
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
import { useApp } from '../../context/AppContext';
import { Button, Card } from '../../components/common';
import { FreshnessIndicator, CategoryBadge } from '../../components/inventory';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

export default function ItemDetailScreen({ route, navigation }) {
    const { item } = route.params;
    const { consumeItem, wasteItem, removeItem } = useApp();
    const [isLoading, setIsLoading] = useState(false);

    const handleConsume = async () => {
        setIsLoading(true);
        await consumeItem(item.id);
        setIsLoading(false);
        navigation.goBack();
    };

    const handleWaste = () => {
        Alert.alert(
            'Mark as Wasted',
            'Why are you throwing this away?',
            [
                { text: 'Forgot about it', onPress: () => handleWasteConfirm('forgot') },
                { text: 'Spoiled', onPress: () => handleWasteConfirm('spoiled') },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const handleWasteConfirm = async (reason) => {
        setIsLoading(true);
        await wasteItem(item.id, { reason });
        setIsLoading(false);
        navigation.goBack();
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Item',
            'Are you sure you want to delete this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await removeItem(item.id);
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Not set';
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {/* Header Card */}
                <Card style={styles.headerCard}>
                    <View style={styles.headerTop}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('AddItem', { editItem: item })}>
                            <Ionicons name="pencil" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerInfo}>
                        <CategoryBadge category={item.category} />
                        <FreshnessIndicator daysUntilExpiry={item.days_until_expiry} size="md" />
                    </View>
                </Card>

                {/* Details */}
                <Card style={styles.detailsCard}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <Ionicons name="layers-outline" size={20} color={colors.textMuted} />
                        </View>
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Quantity</Text>
                            <Text style={styles.detailValue}>{item.quantity} {item.unit}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <Ionicons name="location-outline" size={20} color={colors.textMuted} />
                        </View>
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Storage</Text>
                            <Text style={styles.detailValue}>{item.storage?.charAt(0).toUpperCase() + item.storage?.slice(1)}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
                        </View>
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Expires</Text>
                            <Text style={styles.detailValue}>{formatDate(item.expiration_date)}</Text>
                        </View>
                    </View>

                    {item.purchase_date && (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.detailRow}>
                                <View style={styles.detailIcon}>
                                    <Ionicons name="cart-outline" size={20} color={colors.textMuted} />
                                </View>
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>Purchased</Text>
                                    <Text style={styles.detailValue}>{formatDate(item.purchase_date)}</Text>
                                </View>
                            </View>
                        </>
                    )}

                    {item.notes && (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.detailRow}>
                                <View style={styles.detailIcon}>
                                    <Ionicons name="document-text-outline" size={20} color={colors.textMuted} />
                                </View>
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>Notes</Text>
                                    <Text style={styles.detailValue}>{item.notes}</Text>
                                </View>
                            </View>
                        </>
                    )}
                </Card>

                {/* Actions */}
                <View style={styles.actions}>
                    <Button
                        title="Mark as Consumed"
                        onPress={handleConsume}
                        loading={isLoading}
                        size="lg"
                        icon={<Ionicons name="checkmark-circle" size={20} color={colors.white} />}
                    />

                    <Button
                        title="Mark as Wasted"
                        onPress={handleWaste}
                        variant="outline"
                        size="lg"
                        style={styles.wasteButton}
                        icon={<Ionicons name="trash-outline" size={20} color={colors.primary} />}
                    />

                    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                        <Text style={styles.deleteText}>Delete Item</Text>
                    </TouchableOpacity>
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
    },
    headerCard: {
        padding: spacing.xl,
        marginBottom: spacing.base,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.base,
    },
    itemName: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
        flex: 1,
        marginRight: spacing.base,
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.base,
    },
    detailsCard: {
        padding: spacing.base,
        marginBottom: spacing.xl,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    detailIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.base,
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: colors.textMuted,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.xs,
    },
    actions: {
        gap: spacing.sm,
    },
    wasteButton: {
        borderColor: colors.warning,
    },
    deleteButton: {
        alignItems: 'center',
        padding: spacing.base,
    },
    deleteText: {
        color: colors.danger,
        fontSize: 14,
        fontWeight: '500',
    },
});
