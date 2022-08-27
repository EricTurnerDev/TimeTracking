export default function Grid({children}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-2.5 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 auto-rows-fr">
            {children}
        </div>
    )
}