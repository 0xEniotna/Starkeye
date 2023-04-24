import React from 'react'

interface LeaderboardModalProps {
    visible: boolean
    onClose: () => void
    data: any
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
    visible,
    onClose,
    data,
}) => {
    if (!visible) {
        return null
    }

    return (
        <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Add a background overlay */}
                <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                {/* The leaderboard modal */}
                <div
                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                >
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h2 className="text-lg font-semibold mb-4">
                            Leaderboard
                        </h2>
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Address 1</th>
                                    <th>Address 2</th>
                                    <th>Volume Ξ</th>
                                    <th>Value Ξ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item: any, index: number) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            {item.from.slice(0, 6)}...
                                            {item.from.slice(-4)}
                                        </td>
                                        <td>
                                            {item.to.slice(0, 6)}...
                                            {item.to.slice(-4)}
                                        </td>
                                        <td>{item.absVolume}</td>
                                        <td>{item.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button
                        type="button"
                        className="absolute top-4 right-4 inline-flex justify-center rounded-md shadow-sm text-base font-medium text-black hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:text-sm"
                        onClick={onClose}
                    >
                        X
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LeaderboardModal
