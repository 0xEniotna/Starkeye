
const Top = () => {
    
    
    return (
        <div className="z-40 bg-opacity-100 py-10 w-1/2 m-auto absolute">
            <h1 className="text-center font-bold text-4xl">{'STAR(s)KY'}</h1>
            <div className="flex flex-col w-2/3 m-auto mt-8">
                <input className="h-10 rounded-xl text-center" placeholder="address">
                </input>
                <div className="flex flex-row pt-5 justify-evenly">
                    <button className="h-10 rounded-xl bg-slate-400 py-3 px-5">Search</button>
                    <button className="h-10 rounded-xl bg-slate-400 py-3 px-5">Reset</button>
                </div>
            </div>
        </div>
    )
}

export default Top;