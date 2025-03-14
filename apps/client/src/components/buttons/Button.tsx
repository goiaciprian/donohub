import React from 'react';

type ButtonProps = {
    display: string;
} & React.ButtonHTMLAttributes<unknown>;
export const Button = ({
    display,
    ...rest
}: ButtonProps) => {
    return <button className='bg-mint-500 px-8 py-3 rounded-xl text-md font-bold' {...rest}>{display}</button>
}