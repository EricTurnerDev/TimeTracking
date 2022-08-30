import classNames from 'classnames';
import {ReactNode} from 'react';

interface ICardProps {
    className?: string;
    children?: ReactNode;
}

const Card = ({ className, children }: ICardProps) => {
    return (
        <div className={classNames('flex flex-col overflow-hidden bg-gray-50 rounded shadow', className)}>
            {children}
        </div>
    )
}

interface ICardHeaderProps extends ICardProps {}

const Header = ({ className, children }: ICardHeaderProps) => {
    return (
        <div className={classNames('flex flex-grow bg-blue-500 border-b border-gray-200 p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-7', className)}>
            {children}
        </div>
    )
}

interface ICardBodyProps extends ICardProps {}

const Body = ({ className, children }: ICardBodyProps) => {
    return (
        <div className={classNames('p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-7', className)}>
            {children}
        </div>
    )
}

interface ICardFooterProps extends ICardProps {}

const Footer = ({ className, children }: ICardFooterProps) => {

    return (
        <div className={classNames('border-t border-gray-200 p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-7', className)}>
            {children}
        </div>
    )
}

Card.Header = Header;
Card.Body = Body;
Card.Footer = Footer;

export default Card;