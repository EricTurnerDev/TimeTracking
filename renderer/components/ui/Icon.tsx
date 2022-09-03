import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faClock, faHome, faPeopleGroup, faPlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import classNames from 'classnames';

const styles = {
    base: 'mr-1'
};

// Use our own interface type and icon definitions to wrap FontAwesome in case
// we need to change the icon library we use, so we won't to have to change
// it everywhere icons are used in our code.
interface IIconType extends IconDefinition {}
export const clock:IIconType = faClock;
export const home:IIconType = faHome;
export const people:IIconType = faPeopleGroup;
export const plus:IIconType = faPlus;
export const trash:IIconType = faTrash;

interface IIconProps {
    className?: string;
    icon: IIconType;
    [x:string]: any;
}

export function Icon({icon, className, ...rest}: IIconProps) {
    return (
        <FontAwesomeIcon
            className={classNames(styles.base, className)}
            icon={icon}
            {...rest} />
    )
}