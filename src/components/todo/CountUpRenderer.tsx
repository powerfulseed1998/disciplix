import React, { useEffect, useRef } from 'react';
import { Text } from 'react-native';
import { useCountUp } from 'use-count-up';

const CountUpRendererInner = ({
    start,
    end,
    suffix,
    style,
}: {
    start: number;
    end: number;
    suffix?: string;
    style?: any;
}) => {
    const { value: count } = useCountUp({
        isCounting: true,
        start,
        end,
        duration: 1,
        easing: 'easeOutCubic',
    });

    return (
        <Text style={style}>
            {count}
            {suffix}
        </Text>
    );
};

export const CountUpText = ({
    value,
    suffix = '',
    style,
}: {
    value: number;
    suffix?: string;
    style?: any;
}) => {
    const prevValueRef = useRef(0);

    useEffect(() => {
        prevValueRef.current = value;
    }, [value]);

    return (
        <CountUpRendererInner
            key={value}
            start={prevValueRef.current}
            end={value}
            suffix={suffix}
            style={style}
        />
    );
};
