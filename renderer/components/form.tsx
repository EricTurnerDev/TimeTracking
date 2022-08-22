import classNames from 'classnames';
import {ReactNode} from 'react';

interface IFormComponentProps {
    className?: string;
    children?: ReactNode;
    [x:string]: any;
}

export function Button({className, children, ...props}: IFormComponentProps) {
    return (
        <button className={classNames('button px-6 py-2.5 text-white font-medium text-xs leading-tight rounded bg-blue-500 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg focus:outline-none focus:ring-0 transition duration-150 ease-in-out', className)}
                {...props}>
            {children}
        </button>
    )
}

export function Label({className, children, ...props}: IFormComponentProps) {
    return (
        <label className={classNames('label block font-bold', className)} {...props}>{children}</label>
    )
}

export function Input({className, children, ...props}: IFormComponentProps) {
    return (
        <input className={classNames('input form-control min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none', className)} {...props}>{children}</input>
    )
}

export function Textarea({className, children, ...props}: IFormComponentProps) {
    return (
        <textarea className={classNames('textarea form-control min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none', className)} {...props}>{children}</textarea>
    )
}