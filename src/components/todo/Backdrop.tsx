import React from 'react';
import { View, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';

interface BackdropProps {
    isVisible: boolean;
    backdropStyle: any;
    onPress: () => void;
}

const Backdrop = ({ isVisible, backdropStyle, onPress }: BackdropProps) => {
    if (!isVisible) return null;

    return (
        <Animated.View
            className="absolute inset-0 bg-black"
            style={backdropStyle}
        >
            <Pressable className="absolute inset-0" onPress={onPress} />
        </Animated.View>
    );
};

export default Backdrop;
