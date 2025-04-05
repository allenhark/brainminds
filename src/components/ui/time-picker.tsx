import React from 'react';
import { Input } from './input';

interface TimePickerProps {
    value: string;
    onChange: (value: string) => void;
}

export const TimePickerDemo: React.FC<TimePickerProps> = ({ value, onChange }) => {
    return (
        <Input
            type="time"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
        />
    );
};