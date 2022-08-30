import classNames from 'classnames';
import Head from 'next/head';
import H1 from '../components/ui/H1';

export default function Timekeeping() {
    return (
        <div className={classNames('timekeeping')}>
            <Head>
                <title>Timekeeping - TimeTracking</title>
            </Head>

            <H1>Timekeeping</H1>
        </div>
    )
}