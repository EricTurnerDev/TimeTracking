import classNames from 'classnames';
import {ReactNode, forwardRef, ForwardedRef} from 'react';

const styles = {
    base: 'min-w-fit max-w-fit px-4 py-2 focus:outline-none transition ease-in-out duration-300 rounded shadow-md',
    disabled: 'opacity-50 cursor-not-allowed',
    pill: 'rounded-3xl',
    variant: {
        primary: 'bg-blue-500 hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 text-gray-900 hover:text-white',
        danger: 'bg-red-500 hover:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-white'
    }
}

interface IButtonProps {
    className?: string;
    children?: ReactNode;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger';
    pill?: any;

    [x: string]: any;
}

const Button = forwardRef(
    (
        {
            className,
            children,
            type = 'button',
            variant = 'primary',
            pill,
            disabled = false,
            ...props
        }: IButtonProps, ref: ForwardedRef<HTMLButtonElement>
    ) => {
        return (
                <button
                    className={classNames(
                        'button',
                        styles.base,
                        styles.variant[variant],
                        pill && styles.pill,
                        disabled && styles.disabled,
                        className)}
                    disabled={disabled}
                    type={type}
                    ref={ref}
                    {...props}>
                    {children}
                </button>
        )
    });

export default Button;
