import React, { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // Adjust path if needed
import FilterModal from './components/FilterModal'; // Adjust path if needed
import { Search, ArrowUpDown, Filter, CheckCircle2 as CheckCircleIcon } from 'lucide-react';

// --- Helper Functions (keep them or move to a utils file) ---
const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty) {
        case 'easy': return 'text-success';
        case 'medium': return 'text-warning';
        case 'hard': return 'text-error';
        default: return 'text-base-content';
    }
};

// --- Mock Data (replace with your actual API calls) ---
const allProblems = [
    { _id: '1', title: 'Find Lucky Integer in an Array', difficulty: 'easy', tags: 'array', solvedBy: ['user1'] },
    { _id: '2', title: 'Two Sum', difficulty: 'easy', tags: 'array', solvedBy: [] },
    { _id: '3', title: 'Longest Substring Without Repeating Characters', difficulty: 'medium', tags: 'string', solvedBy: ['user1'] },
    { _id: '4', title: 'Median of Two Sorted Arrays', difficulty: 'hard', tags: 'array', solvedBy: [] },
    { _id: '5', title: 'Validate Binary Search Tree', difficulty: 'medium', tags: 'graph', solvedBy: [] },
];

const ProblemsPage = () => {
    // --- State Management ---
    const [user, setUser] = useState({ id: 'user1' }); // Mock user
    const [isLoading, setIsLoading] = useState(true);
    const [problems, setProblems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        difficulty: 'all',
        tag: 'all',
    });
    
    // --- Data Fetching ---
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setProblems(allProblems);
            setIsLoading(false);
        }, 1000);
    }, []);

    // --- Filtering Logic ---
    const filteredProblems = useMemo(() => {
        return problems
            .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .filter(p => filters.status === 'all' || (filters.status === 'solved' && p.solvedBy.includes(user.id)))
            .filter(p => filters.difficulty === 'all' || p.difficulty === filters.difficulty)
            .filter(p => filters.tag === 'all' || p.tags === filters.tag);
    }, [problems, searchQuery, filters, user]);
    
    // Check if the current user has solved a problem
    const isSolved = (problem) => user && problem.solvedBy.includes(user.id);

    return (
        <div className="drawer lg:drawer-open">
            {/* Hidden checkbox to control the drawer on mobile */}
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            
            {/* ---- Page Content ---- */}
            <main className="drawer-content flex flex-col bg-base-100">
                {/* Mobile header with drawer toggle */}
                <div className="lg:hidden navbar bg-base-100 sticky top-0 z-30">
                     <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost drawer-button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </label>
                    <div className="flex-1">
                        <span className="text-xl font-bold ml-2">Problems</span>
                    </div>
                </div>

                {/* Main content area */}
                <div className="p-4 sm:p-6 flex-grow flex flex-col">
                    {/* Search and Filter Bar */}
                    <div className="flex items-center gap-2 mb-4">
                        <label className="input input-bordered flex items-center gap-2 flex-grow">
                            <Search size={16} className="opacity-50" />
                            <input 
                                type="text" 
                                className="grow" 
                                placeholder="Search questions" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </label>
                        <button className="btn btn-ghost btn-circle">
                            <ArrowUpDown size={20} />
                        </button>
                        <button className="btn btn-ghost btn-circle" onClick={() => setIsFilterModalOpen(true)}>
                            <Filter size={20} />
                        </button>
                    </div>

                    {/* Problems List */}
                    <div className="flex-grow overflow-y-auto">
                        {isLoading ? (
                            <div className="text-center py-20">
                               <span className="loading loading-dots loading-lg text-primary"></span>
                               <p className="mt-4 text-lg text-base-content opacity-75">Loading problems...</p>
                            </div>
                        ) : filteredProblems.length > 0 ? (
                            <div className="space-y-2">
                                {filteredProblems.map((problem, index) => (
                                    <div key={problem._id} className="bg-base-100 hover:bg-base-200 transition-colors duration-200 rounded-lg">
                                        <div className="p-3 sm:p-4">
                                            <div className="flex items-center w-full space-x-2 sm:space-x-4">
                                                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                                    {isSolved(problem) && <CheckCircleIcon className="text-success w-5 h-5" />}
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <NavLink to={`/problem/${problem._id}`} className="group flex items-baseline gap-1.5 text-base-content focus:outline-none" title={problem.title}>
                                                        <span className="text-sm text-base-content/70 group-hover:text-primary">{index + 1}.</span>
                                                        <span className="font-medium text-sm sm:text-base truncate group-hover:text-primary">{problem.title}</span>
                                                    </NavLink>
                                                </div>
                                                <div className={`flex-shrink-0 w-[70px] sm:w-20 text-center text-xs sm:text-sm font-medium ${getDifficultyBadgeColor(problem.difficulty)}`}>
                                                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                                                </div>
                                                <div className="flex-shrink-0 w-20 sm:w-24 text-center hidden sm:block">
                                                    <span className="badge badge-ghost badge-sm capitalize truncate">{problem.tags}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <h3 className="text-xl font-semibold mt-4">No problems found.</h3>
                                <p className="opacity-70">Try adjusting your filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* ---- Sidebar ---- */}
            <div className="drawer-side" style={{ zIndex: 40 }}> {/* Ensure sidebar is on top of content but below navbar */}
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label> 
                <Sidebar />
            </div>

            {/* ---- Filter Modal ---- */}
            <FilterModal 
                isOpen={isFilterModalOpen} 
                onClose={() => setIsFilterModalOpen(false)}
                filters={filters}
                setFilters={setFilters}
            />
        </div>
    );
};

export default ProblemsPage;