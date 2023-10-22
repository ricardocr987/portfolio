import React, { ChangeEvent } from 'react';

interface InputProps {
    id: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    type: string;
    required?: boolean;
}

function Input({ id, name, value, onChange, placeholder, type, required }: InputProps) {
    return (
        <input
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
            required={required}
            className="w-full border border-gray-300 rounded-md p-2 text-black"
        />
    );
}

export default Input;
