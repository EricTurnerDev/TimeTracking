import {ReactNode} from 'react';
import BaseText from './BaseText';

interface IH2Props {
    className?: string;
    children: ReactNode;
    [x:string]: any;
}

const H2 = ({className, children, ...rest}: IH2Props) => {
    return (
        <BaseText className={className} as='h2' {...rest}>{children}</BaseText>
    )
}

export default H2;