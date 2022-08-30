import {ReactNode} from 'react';
import BaseText from './BaseText';

interface IH1Props {
    className?: string;
    children: ReactNode;
}

const H1 = ({className, children}: IH1Props) => {
    return (
        <BaseText className={className} as='h1'>{children}</BaseText>
    )
}

export default H1;