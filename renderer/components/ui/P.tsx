import {ReactNode} from 'react';
import BaseText from './BaseText';

interface IPProps {
    className?: string;
    children: ReactNode;
    [x:string]: any;
}

const P = ({className, children, ...rest}: IPProps) => {
    return (
        <BaseText className={className} as='p' {...rest}>{children}</BaseText>
    )
}

export default P;