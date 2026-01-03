/**
 * Inventory Screen
 * List of all inventory items with filters
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { ItemCard, StorageTabs, CategoryBadge } from '../../components/inventory';
import { LoadingSpinner, Card } from '../../components/common';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

const CATEGORIES = ['all', 'dairy', 'meat', 'vegetables', 'fruits', 'bread', 'frozen', 'other'];

export default function InventoryScreen({ navigation }) {
    const { items, fetchItems, consumeItem, wasteItem, isLoading } = useApp();
    const [refreshing, setRefreshing] = useState(false);
    const [storage, setStorage] = useState('all');
    const [category, setCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadItems();
    }, [storage, category]);

    const loadItems = async () => {
        const filters = {};
        if (storage !== 'all') filters.storage = storage;
        if (category !== 'all') filters.category = category;
        if (searchQuery) filters.search = searchQuery;
        await fetchItems(filters);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadItems();
        setRefreshing(false);
    }, [storage, category, searchQuery]);

    const handleSearch = () => {
        loadItems();
    };

    const handleConsume = async (item) => {
        await consumeItem(item.id);
        loadItems();
    };

    const handleWaste = async (item) => {
        await wasteItem(item.id, { reason: 'forgot' });
        loadItems();
    };

    const filteredItems = items.filter((item) => {
        if (searchQuery) {
            return item.name.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    });

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>My Inventory</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => navigation.navigate('ScanBarcode')}
                    >
                        <Ionicons name="barcode-outline" size={22} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={20} color={colors.textMuted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search items..."
                        placeholderTextColor={colors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Storage Tabs */}
            <View style={styles.tabsContainer}>
                <StorageTabs activeStorage={storage} onStorageChange={setStorage} />
            </View>

            {/* Category Filter */}
            <FlatList
                horizontal
                data={CATEGORIES}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                style={styles.categoryList}
                contentContainerStyle={styles.categoryContent}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.categoryChip,
                            category === item && styles.categoryChipActive,
                        ]}
                        onPress={() => setCategory(item)}
                    >
                        <Text
                            style={[
                                styles.categoryChipText,
                                category === item && styles.categoryChipTextActive,
                            ]}
                        >
                            {item === 'all' ? 'All' : item.charAt(0).toUpperCase() + item.slice(1)}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {/* Items List */}
            {isLoading && !refreshing ? (
                <LoadingSpinner />
            ) : (
                <FlatList
                    data={filteredItems}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                    }
                    renderItem={({ item }) => (
                        <ItemCard
                            item={item}
                            onPress={() => navigation.navigate('ItemDetail', { item })}
                            onConsume={() => handleConsume(item)}
                            onWaste={() => handleWaste(item)}
                        />
                    )}
                    ListEmptyComponent={
                        <Card style={styles.emptyCard}>
                            <Ionicons name="cube-outline" size={48} color={colors.textMuted} />
                            <Text style={styles.emptyText}>No items found</Text>
                            <Text style={styles.emptySubtext}>Add your first item to get started</Text>
                        </Card>
                    }
                />
            )}

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddItem')}
            >
                <Ionicons name="add" size={28} color={colors.white} />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.base,
        paddingTop: spacing.base,
        paddingBottom: spacing.sm,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
    },
    headerButtons: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainer: {
        paddingHorizontal: spacing.base,
        paddingBottom: spacing.sm,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.base,
        gap: spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        paddingVertical: spacing.md,
    },
    tabsContainer: {
        paddingHorizontal: spacing.base,
        marginBottom: spacing.sm,
    },
    categoryList: {
        maxHeight: 40,
    },
    categoryContent: {
        paddingHorizontal: spacing.base,
        gap: spacing.sm,
    },
    categoryChip: {
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surface,
        marginRight: spacing.sm,
    },
    categoryChipActive: {
        backgroundColor: colors.primary,
    },
    categoryChipText: {
        fontSize: 13,
        color: colors.textMuted,
        fontWeight: '500',
    },
    categoryChipTextActive: {
        color: colors.white,
    },
    listContent: {
        padding: spacing.base,
        paddingBottom: 100,
    },
    emptyCard: {
        alignItems: 'center',
        padding: spacing['2xl'],
        marginTop: spacing.xl,
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
    fab: {
        position: 'absolute',
        right: spacing.xl,
        bottom: spacing.xl,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});
