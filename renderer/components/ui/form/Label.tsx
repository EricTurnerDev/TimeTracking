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

const Label = ({id, className, children, ...props}: IBaseLabelProps) => {
    return (
        <label
            className={classNames('label', styles.base, className)}
            htmlFor={id}
            {...props}>
            {children}
        </label>
    )
}

export default Label;