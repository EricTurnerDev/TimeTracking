import {ReactNode} from 'react';
import BaseText from './BaseText';

interface ISpanProps {
    className?: string;
    children: ReactNode;
    [x:string]: any;
}

const Span = ({className, children, ...rest}: ISpanProps) => {
    return (
        <BaseText className={className} as='span' {...rest}>{children}</BaseText>
    )
}

export default Span;