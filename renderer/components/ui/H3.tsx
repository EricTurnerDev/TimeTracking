import {ReactNode} from 'react';
import BaseText from './BaseText';

interface IH3Props {
    className?: string;
    children: ReactNode;
    [x:string]: any;
}

const H3 = ({className, children, ...rest}: IH3Props) => {
    return (
        <BaseText className={className} as='h3' {...rest}>{children}</BaseText>
    )
}

export default H3;