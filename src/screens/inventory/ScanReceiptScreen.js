/**
 * Scan Receipt Screen
 * Camera view for receipt OCR
 */

import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Alert,
    Image,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { inventoryApi } from '../../api';
import { Button, LoadingSpinner } from '../../components/common';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

export default function ScanReceiptScreen({ navigation }) {
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const cameraRef = useRef(null);

    if (!permission) {
        return <LoadingSpinner fullScreen />;
    }

    if (!permission.granted) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.permissionContainer}>
                    <Ionicons name="camera-outline" size={64} color={colors.textMuted} />
                    <Text style={styles.permissionTitle}>Camera Permission</Text>
                    <Text style={styles.permissionText}>
                        We need camera access to scan your receipts
                    </Text>
                    <Button title="Grant Permission" onPress={requestPermission} />
                </View>
            </SafeAreaView>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
            setPhoto(photo);
        }
    };

    const processReceipt = async () => {
        if (!photo) return;

        setIsProcessing(true);
        try {
            console.log('📷 Processing receipt image:', photo.uri);
            const result = await inventoryApi.scanReceipt({ uri: photo.uri });
            console.log('📝 Receipt scan result:', JSON.stringify(result));

            // Check for successful response with items
            if (result?.success && result?.data?.items?.length > 0) {
                // Navigate to review screen with parsed items
                navigation.replace('AddItem', { parsedItems: result.data.items });
            } else if (result?.success && result?.data?.raw_text) {
                // OCR worked but no items parsed
                Alert.alert(
                    'No Items Found',
                    `Could not identify items. Raw text detected:\n\n${result.data.raw_text.substring(0, 200)}...`,
                    [{ text: 'OK', onPress: () => setPhoto(null) }]
                );
            } else {
                const errorMsg = result?.error?.message || 'Could not process receipt';
                Alert.alert('Processing Failed', errorMsg);
                setPhoto(null);
            }
        } catch (error) {
            console.error('Receipt scan error:', error);
            const errorMessage = error?.response?.data?.error?.message || 'Failed to process receipt. Please try again.';
            Alert.alert('Error', errorMessage);
            setPhoto(null);
        }
        setIsProcessing(false);
    };

    if (photo) {
        return (
            <SafeAreaView style={styles.container}>
                <Image source={{ uri: photo.uri }} style={styles.preview} />
                <View style={styles.previewActions}>
                    {isProcessing ? (
                        <View style={styles.processingContainer}>
                            <LoadingSpinner message="Processing receipt..." />
                        </View>
                    ) : (
                        <>
                            <Button
                                title="Retake"
                                onPress={() => setPhoto(null)}
                                variant="outline"
                                style={styles.previewButton}
                            />
                            <Button
                                title="Use Photo"
                                onPress={processReceipt}
                                style={styles.previewButton}
                            />
                        </>
                    )}
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <CameraView style={styles.camera} ref={cameraRef}>
                <View style={styles.overlay}>
                    <View style={styles.scanFrame} />
                    <Text style={styles.instruction}>
                        Position your receipt within the frame
                    </Text>
                </View>
            </CameraView>

            <View style={styles.controls}>
                <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                    <View style={styles.captureInner} />
                </TouchableOpacity>
            </View>
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
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    scanFrame: {
        width: 300,
        height: 400,
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: borderRadius.lg,
        backgroundColor: 'transparent',
    },
    instruction: {
        color: colors.white,
        fontSize: 14,
        marginTop: spacing.xl,
        textAlign: 'center',
    },
    controls: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
        backgroundColor: colors.background,
    },
    captureButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 4,
        borderColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    captureInner: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.white,
    },
    preview: {
        flex: 1,
        resizeMode: 'contain',
    },
    previewActions: {
        flexDirection: 'row',
        padding: spacing.base,
        gap: spacing.base,
        backgroundColor: colors.background,
    },
    previewButton: {
        flex: 1,
    },
    processingContainer: {
        flex: 1,
        alignItems: 'center',
        padding: spacing.xl,
    },
});
