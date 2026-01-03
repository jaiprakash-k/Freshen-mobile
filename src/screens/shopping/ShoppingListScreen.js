/**
 * Shopping List Screen
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
    TextInput,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { shoppingApi } from '../../api';
import { Card, LoadingSpinner } from '../../components/common';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

export default function ShoppingListScreen() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [newItem, setNewItem] = useState('');

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const response = await shoppingApi.getShoppingList();
            setItems(response.data?.items || []);
        } catch (error) {
            console.error('Failed to load shopping list:', error);
        }
        setIsLoading(false);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadItems();
        setRefreshing(false);
    }, []);

    const handleAddItem = async () => {
        if (!newItem.trim()) return;

        try {
            await shoppingApi.addShoppingItem({ name: newItem.trim() });
            setNewItem('');
            loadItems();
        } catch (error) {
            Alert.alert('Error', 'Failed to add item');
        }
    };

    const handleToggleItem = async (item) => {
        try {
            await shoppingApi.updateShoppingItem(item.id, { checked: !item.checked });
            setItems(items.map((i) => (i.id === item.id ? { ...i, checked: !i.checked } : i)));
        } catch (error) {
            console.error('Failed to toggle item:', error);
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await shoppingApi.deleteShoppingItem(itemId);
            setItems(items.filter((i) => i.id !== itemId));
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.itemCard, item.checked && styles.itemCardChecked]}
            onPress={() => handleToggleItem(item)}
            onLongPress={() => {
                Alert.alert('Delete Item', `Remove ${item.name}?`, [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => handleDeleteItem(item.id) },
                ]);
            }}
        >
            <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                {item.checked && <Ionicons name="checkmark" size={16} color={colors.white} />}
            </View>
            <View style={styles.itemContent}>
                <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
                    {item.name}
                </Text>
                {item.quantity > 1 && (
                    <Text style={styles.itemQuantity}>
                        {item.quantity} {item.unit}
                    </Text>
                )}
            </View>
            {item.auto_generated && (
                <View style={styles.autoBadge}>
                    <Text style={styles.autoBadgeText}>Auto</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    const checkedItems = items.filter((i) => i.checked);
    const uncheckedItems = items.filter((i) => !i.checked);

    if (isLoading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Shopping List</Text>
                <Text style={styles.subtitle}>{uncheckedItems.length} items to buy</Text>
            </View>

            {/* Add Item Input */}
            <View style={styles.addContainer}>
                <TextInput
                    style={styles.addInput}
                    placeholder="Add an item..."
                    placeholderTextColor={colors.textMuted}
                    value={newItem}
                    onChangeText={setNewItem}
                    onSubmitEditing={handleAddItem}
                    returnKeyType="done"
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
                    <Ionicons name="add" size={24} color={colors.white} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={[...uncheckedItems, ...checkedItems]}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
                renderItem={renderItem}
                ListEmptyComponent={
                    <Card style={styles.emptyCard}>
                        <Ionicons name="cart-outline" size={48} color={colors.textMuted} />
                        <Text style={styles.emptyText}>Your list is empty</Text>
                        <Text style={styles.emptySubtext}>Add items to get started</Text>
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
    addContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacing.base,
        paddingBottom: spacing.base,
        gap: spacing.sm,
    },
    addInput: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.md,
        fontSize: 16,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
    },
    addButton: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        padding: spacing.base,
        paddingTop: 0,
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.base,
        marginBottom: spacing.sm,
    },
    itemCardChecked: {
        opacity: 0.6,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    checkboxChecked: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    itemContent: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    itemNameChecked: {
        textDecorationLine: 'line-through',
        color: colors.textMuted,
    },
    itemQuantity: {
        fontSize: 13,
        color: colors.textMuted,
        marginTop: 2,
    },
    autoBadge: {
        backgroundColor: colors.secondary + '20',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.full,
    },
    autoBadgeText: {
        fontSize: 10,
        color: colors.secondary,
        fontWeight: '600',
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
