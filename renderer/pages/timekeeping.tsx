import classNames from 'classnames';
import Head from 'next/head';

export default function Timekeeping() {
    return (
        <div className={classNames('timekeeping')}>
            <Head>
                <title>Timekeeping - TimeTracking</title>
            </Head>

            <h1>Timekeeping</h1>
        </div>
    )
}