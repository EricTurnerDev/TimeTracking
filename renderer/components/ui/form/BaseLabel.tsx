import classNames from 'classnames';
import {ReactNode} from 'react';

const styles = {
    base: 'block mb-2 text-base font-medium text-gray-400',
}

interface IBaseLabelProps {
    id: string;
    className?: string;
    children?: ReactNode
}

const BaseLabel = ({id, className, children}: IBaseLabelProps) => {
    return (
        <label
            className={classNames('base-label', styles.base, className)}
            htmlFor={id}>
            {children}
        </label>
    )
}

export default BaseLabel;