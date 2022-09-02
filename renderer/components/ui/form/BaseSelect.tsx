import {ReactNode, useId} from 'react';
import classNames from 'classnames';

import BaseLabel from './BaseLabel';

const styles = {
    base: 'text-gray-700 w-full'
};

interface IBaseSelectProps {
    id?: string;
    label?: string;
    required?: boolean;
    className?: string;
    children?: ReactNode;

    [x: string]: any;
}

const BaseSelect = ({
                        id,
                        label,
                        required = false,
                        className,
                        children,
                        ...rest
                    }: IBaseSelectProps) => {

    const selectId = useId();

    return (
        <div className={classNames('base-select', className)} id={id}>
            {label && <BaseLabel id={selectId}>{label}{required && ' *'}</BaseLabel>}
            <select
                id={id}
                className={classNames(
                    styles.base,
                )}
                required={required}
                {...rest}>
                {children}
            </select>

            {/*// TODO: error*/}
        </div>
    )
};

export default BaseSelect;