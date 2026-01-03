/**
 * Add Item Screen
 * Manual item entry form
 */

import React, { useState, useEffect } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { useApp } from '../../context/AppContext';
import { Button, Input, Card } from '../../components/common';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

const CATEGORIES = [
    { id: 'dairy', label: 'Dairy', icon: 'water-outline' },
    { id: 'meat', label: 'Meat', icon: 'restaurant-outline' },
    { id: 'vegetables', label: 'Vegetables', icon: 'leaf-outline' },
    { id: 'fruits', label: 'Fruits', icon: 'nutrition-outline' },
    { id: 'bread', label: 'Bread', icon: 'basket-outline' },
    { id: 'frozen', label: 'Frozen', icon: 'snow-outline' },
    { id: 'beverages', label: 'Beverages', icon: 'wine-outline' },
    { id: 'other', label: 'Other', icon: 'ellipse-outline' },
];

const STORAGE_OPTIONS = [
    { id: 'fridge', label: 'Fridge', icon: 'snow-outline' },
    { id: 'freezer', label: 'Freezer', icon: 'cube-outline' },
    { id: 'pantry', label: 'Pantry', icon: 'file-tray-stacked-outline' },
];

const UNITS = ['piece', 'kg', 'g', 'lb', 'oz', 'L', 'ml', 'pack', 'can', 'bottle'];

export default function AddItemScreen({ navigation, route }) {
    const { addItem } = useApp();
    const [isLoading, setIsLoading] = useState(false);

    // Get prefill data from barcode/receipt scanning
    const prefill = route?.params?.prefill;
    const parsedItems = route?.params?.parsedItems;

    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [unit, setUnit] = useState('piece');
    const [category, setCategory] = useState('other');
    const [storage, setStorage] = useState('fridge');
    const [expirationDate, setExpirationDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [notes, setNotes] = useState('');

    // Handle prefill from barcode or receipt scanning
    useEffect(() => {
        if (prefill) {
            console.log('📝 Prefilling form with:', prefill);
            if (prefill.name) setName(prefill.name);
            if (prefill.category) setCategory(prefill.category);
            if (prefill.suggested_expiry_days) {
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + prefill.suggested_expiry_days);
                setExpirationDate(expiryDate);
            }
        }
        if (parsedItems && parsedItems.length > 0) {
            // For now, just take the first item from receipt
            const firstItem = parsedItems[0];
            console.log('📝 Prefilling from receipt:', firstItem);
            if (firstItem.name) setName(firstItem.name);
            if (firstItem.suggested_category) setCategory(firstItem.suggested_category);
            if (firstItem.quantity) setQuantity(String(firstItem.quantity));
        }
    }, [prefill, parsedItems]);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter an item name');
            return;
        }

        setIsLoading(true);
        const result = await addItem({
            name: name.trim(),
            quantity: parseFloat(quantity) || 1,
            unit,
            category,
            storage,
            expiration_date: expirationDate.toISOString().split('T')[0],
            notes: notes.trim() || null,
        });

        setIsLoading(false);

        if (result.success) {
            navigation.goBack();
        } else {
            Alert.alert('Error', result.error || 'Failed to add item');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {/* Name */}
                <Input
                    label="Item Name"
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g., Milk, Eggs, Apples"
                    autoCapitalize="words"
                />

                {/* Quantity & Unit */}
                <View style={styles.row}>
                    <View style={styles.halfWidth}>
                        <Input
                            label="Quantity"
                            value={quantity}
                            onChangeText={setQuantity}
                            keyboardType="decimal-pad"
                            placeholder="1"
                        />
                    </View>
                    <View style={styles.halfWidth}>
                        <Text style={styles.label}>Unit</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.unitRow}>
                                {UNITS.slice(0, 5).map((u) => (
                                    <TouchableOpacity
                                        key={u}
                                        style={[styles.unitChip, unit === u && styles.unitChipActive]}
                                        onPress={() => setUnit(u)}
                                    >
                                        <Text style={[styles.unitText, unit === u && styles.unitTextActive]}>
                                            {u}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>

                {/* Category */}
                <Text style={styles.label}>Category</Text>
                <View style={styles.optionsGrid}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[styles.optionCard, category === cat.id && styles.optionCardActive]}
                            onPress={() => setCategory(cat.id)}
                        >
                            <Ionicons
                                name={cat.icon}
                                size={20}
                                color={category === cat.id ? colors.primary : colors.textMuted}
                            />
                            <Text style={[styles.optionLabel, category === cat.id && styles.optionLabelActive]}>
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Storage */}
                <Text style={styles.label}>Storage Location</Text>
                <View style={styles.storageRow}>
                    {STORAGE_OPTIONS.map((opt) => (
                        <TouchableOpacity
                            key={opt.id}
                            style={[styles.storageCard, storage === opt.id && styles.storageCardActive]}
                            onPress={() => setStorage(opt.id)}
                        >
                            <Ionicons
                                name={opt.icon}
                                size={24}
                                color={storage === opt.id ? colors.primary : colors.textMuted}
                            />
                            <Text style={[styles.storageLabel, storage === opt.id && styles.storageLabelActive]}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Expiration Date */}
                <Text style={styles.label}>Expiration Date</Text>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                    <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
                    <Text style={styles.dateText}>
                        {expirationDate.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={expirationDate}
                        mode="date"
                        display="spinner"
                        onChange={(event, date) => {
                            setShowDatePicker(false);
                            if (date) setExpirationDate(date);
                        }}
                        minimumDate={new Date()}
                    />
                )}

                {/* Notes */}
                <Input
                    label="Notes (optional)"
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Any additional notes..."
                    multiline
                    numberOfLines={3}
                />

                {/* Save Button */}
                <Button
                    title="Add Item"
                    onPress={handleSave}
                    loading={isLoading}
                    size="lg"
                    style={styles.saveButton}
                />
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
    row: {
        flexDirection: 'row',
        gap: spacing.base,
    },
    halfWidth: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textSecondary,
        marginBottom: spacing.sm,
        marginTop: spacing.sm,
    },
    unitRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    unitChip: {
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    unitChipActive: {
        backgroundColor: `${colors.primary}20`,
        borderColor: colors.primary,
    },
    unitText: {
        fontSize: 13,
        color: colors.textMuted,
        fontWeight: '500',
    },
    unitTextActive: {
        color: colors.primary,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.base,
    },
    optionCard: {
        width: '23%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        gap: spacing.xs,
    },
    optionCardActive: {
        backgroundColor: `${colors.primary}20`,
        borderColor: colors.primary,
    },
    optionLabel: {
        fontSize: 10,
        color: colors.textMuted,
        fontWeight: '500',
    },
    optionLabelActive: {
        color: colors.primary,
    },
    storageRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.base,
    },
    storageCard: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.base,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        gap: spacing.xs,
    },
    storageCardActive: {
        backgroundColor: `${colors.primary}20`,
        borderColor: colors.primary,
    },
    storageLabel: {
        fontSize: 12,
        color: colors.textMuted,
        fontWeight: '500',
    },
    storageLabelActive: {
        color: colors.primary,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.base,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.base,
    },
    dateText: {
        fontSize: 16,
        color: colors.text,
    },
    saveButton: {
        marginTop: spacing.xl,
    },
});
