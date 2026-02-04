"use client";

import { useState } from "react";
import { ImageUploadInput } from "./ImageUploadInput";

interface SettingsImageInputProps {
    initialValue: string;
    name: string;
    label: string;
}

export function SettingsImageInput({
    initialValue,
    name,
    label,
}: SettingsImageInputProps) {
    const [imageUrl, setImageUrl] = useState(initialValue);

    return (
        <ImageUploadInput
            currentImageUrl={imageUrl}
            onUploadComplete={(url) => setImageUrl(url)}
            label={label}
            name={name}
        />
    );
}
