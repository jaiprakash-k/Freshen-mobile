/**
 * Scan Barcode Screen
 * Barcode scanner for product lookup
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { inventoryApi } from '../../api';
import { Button, LoadingSpinner } from '../../components/common';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

export default function ScanBarcodeScreen({ navigation }) {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [isLooking, setIsLooking] = useState(false);
    const lastScannedRef = React.useRef(null);

    if (!permission) {
        return <LoadingSpinner fullScreen />;
    }

    if (!permission.granted) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.permissionContainer}>
                    <Text style={styles.permissionTitle}>Camera Permission</Text>
                    <Text style={styles.permissionText}>
                        We need camera access to scan barcodes
                    </Text>
                    <Button title="Grant Permission" onPress={requestPermission} />
                </View>
            </SafeAreaView>
        );
    }

    const handleBarCodeScanned = async ({ type, data }) => {
        // Prevent duplicate scans of the same barcode within 2 seconds
        const now = Date.now();
        if (scanned || isLooking) return;
        if (lastScannedRef.current?.barcode === data &&
            now - lastScannedRef.current?.time < 2000) {
            return;
        }

        setScanned(true);
        setIsLooking(true);
        lastScannedRef.current = { barcode: data, time: now };

        try {
            console.log('🔍 Looking up barcode:', data);
            const result = await inventoryApi.lookupBarcode(data);
            console.log('📦 Barcode result:', JSON.stringify(result));

            // Check if product was found - handle both response formats
            const productFound = result?.success && result?.data?.found;
            const productData = result?.data;

            if (productFound && productData) {
                navigation.replace('AddItem', {
                    prefill: {
                        name: productData.name,
                        category: productData.category,
                        suggested_expiry_days: productData.suggested_expiry_days,
                    },
                });
            } else {
                Alert.alert(
                    'Product Not Found',
                    'This barcode is not in our database. Would you like to add the item manually?',
                    [
                        { text: 'Cancel', onPress: () => setScanned(false) },
                        { text: 'Add Manually', onPress: () => navigation.replace('AddItem') },
                    ]
                );
            }
        } catch (error) {
            console.error('Barcode lookup error:', error);
            Alert.alert('Error', 'Failed to lookup barcode. Please try again.');
            setScanned(false);
        }

        setIsLooking(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <CameraView
                style={styles.camera}
                barcodeScannerSettings={{
                    barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            >
                <View style={styles.overlay}>
                    <View style={styles.scanArea}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>

                    {isLooking ? (
                        <View style={styles.lookingContainer}>
                            <LoadingSpinner />
                            <Text style={styles.lookingText}>Looking up product...</Text>
                        </View>
                    ) : (
                        <Text style={styles.instruction}>
                            Point your camera at a barcode
                        </Text>
                    )}
                </View>
            </CameraView>

            {scanned && !isLooking && (
                <View style={styles.scanAgain}>
                    <Button title="Scan Again" onPress={() => setScanned(false)} />
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    permissionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
        gap: spacing.base,
    },
    permissionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text,
    },
    permissionText: {
        fontSize: 14,
        color: colors.textMuted,
        textAlign: 'center',
        marginBottom: spacing.base,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    scanArea: {
        width: 280,
        height: 150,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: colors.primary,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderTopLeftRadius: 8,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 3,
        borderRightWidth: 3,
        borderTopRightRadius: 8,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderBottomLeftRadius: 8,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 3,
        borderRightWidth: 3,
        borderBottomRightRadius: 8,
    },
    instruction: {
        color: colors.white,
        fontSize: 16,
        marginTop: spacing['2xl'],
        textAlign: 'center',
    },
    lookingContainer: {
        marginTop: spacing.xl,
        alignItems: 'center',
    },
    lookingText: {
        color: colors.white,
        fontSize: 14,
        marginTop: spacing.sm,
    },
    scanAgain: {
        padding: spacing.base,
        backgroundColor: colors.background,
    },
});
