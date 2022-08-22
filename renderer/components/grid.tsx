export default function Grid({children}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 2xl:grid-cols-12 gap-2.5 auto-rows-fr">
            {children}
        </div>
    )
}