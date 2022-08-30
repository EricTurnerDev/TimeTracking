import Head from 'next/head';
import H1 from '../components/ui/H1';

export default function Home() {
    return (
        <div className="home">
            <Head>
                <title>Home - TimeTracking</title>
            </Head>
            <H1>Home</H1>
        </div>
    );
}
