import classNames from 'classnames';
import {ReactNode} from 'react';

interface ICardProps {
    className?: string;
    children?: ReactNode;
}

const styles = {
    padding: 'p-1 sm:p-2 md:p-3 lg:p-4 xl:p-5 2xl:p-6'
};

const Card = ({ className, children }: ICardProps) => {
    return (
        <div className={classNames('flex flex-col overflow-hidden bg-gray-50 rounded shadow-md', className)}>
            {children}
        </div>
    )
}

interface ICardHeaderProps extends ICardProps {}

const Header = ({ className, children }: ICardHeaderProps) => {
    return (
        <div className={classNames('flex flex-grow bg-blue-500 hover:bg-blue-800 border-b border-gray-200 transition ease-in-out', styles.padding, className)}>
            {children}
        </div>
    )
}

interface ICardBodyProps extends ICardProps {}

const Body = ({ className, children }: ICardBodyProps) => {
    return (
        <div className={classNames(styles.padding, className)}>
            {children}
        </div>
    )
}

interface ICardFooterProps extends ICardProps {}

const Footer = ({ className, children }: ICardFooterProps) => {

    return (
        <div className={classNames('border-t border-gray-200', styles.padding, className)}>
            {children}
        </div>
    )
}

Card.Header = Header;
Card.Body = Body;
Card.Footer = Footer;

export default Card;