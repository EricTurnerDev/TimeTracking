import classNames from 'classnames';
import {FieldHookConfig, useField} from 'formik';

interface IHiddenInput {
    id?: string;
    name: string;
    className?: string;

    [x: string]: string | boolean | FieldHookConfig<any>;
}

const HiddenInput = ({id, className, ...props}: IHiddenInput) => {
    const [field] = useField(props);

    return (
        <div >
            <input
                id={id}
                className={classNames(
                    'hidden-input',
                    className
                )}
                type='hidden'
                {...field}
                {...props}
            />
        </div>
    )
};

export default HiddenInput;

