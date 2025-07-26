import { useSelector } from "react-redux";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { useState } from "react";

const ChartComponent = () => {
    const userData = useSelector((state) => state.backend.data);
    const todayStr = new Date().toISOString().split("T")[0];
    
    // Data processing
    const last7DaysData = userData?.DateWise
        ?.filter((entry) => entry.date !== todayStr)
        ?.sort((a, b) => new Date(b.date) - new Date(a.date))
        ?.slice(0, 7) || [];

    const last15DaysData = userData?.DateWise
        ?.filter((entry) => entry.date !== todayStr)
        ?.sort((a, b) => new Date(b.date) - new Date(a.date))
        ?.slice(0, 15) || [];

    const [activeChart, setActiveChart] = useState(null); // '7days', '15days', or null

    const processChartData = (data) => {
        return data
            .slice()
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((currElem) => ({
                date: format(new Date(currElem.date), "d MMM"),
                totalCalories: currElem.totalCalories || 0,
                caloriesBurnt: currElem.caloriesBurnt || 0,
            }));
    };

    const sevenDaysData = processChartData(last7DaysData);
    const fifteenDaysData = processChartData(last15DaysData);

    const NoDataMessage = () => (
        <div className="mt-6 p-4 rounded-lg bg-blue-50 text-blue-800 text-center text-sm font-medium max-w-md mx-auto">
            {activeChart === '7days' && sevenDaysData.length === 0 && 
                "No data available for the last 7 days. Add entries to see the chart."}
            {activeChart === '15days' && fifteenDaysData.length === 0 && 
                "No data available for the last 15 days. Add entries to see the chart."}
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Calorie Analytics</h2>
                <p className="text-gray-600">Track your calorie intake and expenditure over time</p>
            </div>

            {/* Chart Toggle Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
                <button
                    onClick={() => setActiveChart(activeChart === '7days' ? null : '7days')}
                    className={`px-4 py-2 pointer rounded-full text-sm font-medium transition-all ${
                        activeChart === '7days'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    {activeChart === '7days' ? 'Hide Weekly' : 'Show Weekly'}
                </button>
                <button
                    onClick={() => setActiveChart(activeChart === '15days' ? null : '15days')}
                    className={`px-4 py-2 pointer rounded-full text-sm font-medium transition-all ${
                        activeChart === '15days'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    {activeChart === '15days' ? 'Hide Fortnight' : 'Show Fortnight'}
                </button>
            </div>

            {/* Charts */}
            <div className="space-y-8">
                {activeChart === '7days' && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-center text-gray-700 mb-4">
                            7-Day Calorie Trend
                        </h3>
                        {sevenDaysData.length > 0 ? (
                            <div className="h-64 md:h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={sevenDaysData}
                                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis 
                                            dataKey="date" 
                                            tick={{ fontSize: 12 }}
                                            tickMargin={10}
                                        />
                                        <YAxis 
                                            tick={{ fontSize: 12 }}
                                            tickMargin={10}
                                        />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                border: '1px solid #e5e7eb',
                                            }}
                                        />
                                        <Legend 
                                            wrapperStyle={{
                                                paddingTop: '20px',
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="totalCalories"
                                            stroke="#4f46e5"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                            name="Calorie Intake"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="caloriesBurnt"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                            name="Calorie Burnt"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <NoDataMessage />
                        )}
                    </div>
                )}

                {activeChart === '15days' && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-center text-gray-700 mb-4">
                            15-Day Calorie Trend
                        </h3>
                        {fifteenDaysData.length > 0 ? (
                            <div className="h-64 md:h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={fifteenDaysData}
                                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis 
                                            dataKey="date" 
                                            tick={{ fontSize: 12 }}
                                            tickMargin={10}
                                        />
                                        <YAxis 
                                            tick={{ fontSize: 12 }}
                                            tickMargin={10}
                                        />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                border: '1px solid #e5e7eb',
                                            }}
                                        />
                                        <Legend 
                                            wrapperStyle={{
                                                paddingTop: '20px',
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="totalCalories"
                                            stroke="#4f46e5"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                            name="Calorie Intake"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="caloriesBurnt"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                            name="Calorie Burnt"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <NoDataMessage />
                        )}
                    </div>
                )}
            </div>

            {/* Empty state when no chart is selected */}
            {!activeChart && (
                <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-12 w-12 text-gray-400" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Chart Selected</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Select either the 7-day or 15-day view to visualize your calorie data trends.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ChartComponent;