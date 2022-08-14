export default function Layout({children}) {
    return (
        <>
            <nav className="p-3">
                <h2>Timetracking</h2>
                {/* more navbar code here */}
            </nav>
            <main className="p-3">
                {children}
            </main>
        </>
    )
}