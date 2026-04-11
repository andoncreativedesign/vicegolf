import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react';

interface FilterValue {
    id: string;
    label: string;
    count: number;
    input: string;
}

interface Filter {
    id: string;
    label: string;
    type: string;
    values: FilterValue[];
}

interface SortParam {
    label: string;
    key: string;
}

const SORT_OPTIONS: SortParam[] = [
    { label: 'Featured', key: 'featured' },
    { label: 'Price: Low to High', key: 'price-low-high' },
    { label: 'Price: High to Low', key: 'price-high-low' },
    { label: 'Newest', key: 'newest' },
];

export function SortFilter({
    filters,
    children,
}: {
    filters: Filter[];
    children: ReactNode;
}) {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [openFilters, setOpenFilters] = useState<string[]>(filters.map(f => f.id));

    const activeFilters = Array.from(searchParams.entries())
        .filter(([key]) => key.startsWith('filter.'))
        .map(([key, value]) => ({ key, value }));

    const currentSort = searchParams.get('sort') || 'featured';

    const handleFilterChange = (key: string, value: string, checked: boolean) => {
        const newParams = new URLSearchParams(searchParams);
        if (checked) {
            newParams.append(key, value);
        } else {
            const values = newParams.getAll(key).filter((v) => v !== value);
            newParams.delete(key);
            values.forEach((v) => newParams.append(key, v));
        }
        newParams.delete('cursor');
        newParams.delete('direction');
        navigate(`${location.pathname}?${newParams.toString()}`, { replace: true, preventScrollReset: true });
    };

    const handleSortChange = (sortKey: string) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('sort', sortKey);
        newParams.delete('cursor');
        newParams.delete('direction');
        navigate(`${location.pathname}?${newParams.toString()}`, { replace: true, preventScrollReset: true });
        setIsSortOpen(false);
    };

    const toggleFilterAccordion = (id: string) => {
        setOpenFilters(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const removeFilter = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        const values = newParams.getAll(key).filter((v) => v !== value);
        newParams.delete(key);
        values.forEach((v) => newParams.append(key, v));
        navigate(`${location.pathname}?${newParams.toString()}`, { replace: true, preventScrollReset: true });
    };

    const clearFilters = () => {
        const newParams = new URLSearchParams(searchParams);
        Array.from(newParams.keys()).forEach((key) => {
            if (key.startsWith('filter.')) {
                newParams.delete(key);
            }
        });
        navigate(`${location.pathname}?${newParams.toString()}`, { replace: true, preventScrollReset: true });
    };

    return (
        <div className="w-full">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between py-6 border-b border-gray-100 mb-8 sticky top-0 bg-[var(--main-bg-color)] z-10 mx-[-1rem] px-[1rem]">
                <button
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-gray-600 transition-colors"
                >
                    <SlidersHorizontal size={16} />
                    <span>{isFilterVisible ? 'Hide filters' : 'Show filters'}</span>
                </button>

                <div className="relative">
                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="flex items-center gap-1 text-xs font-medium hover:text-gray-600 transition-colors uppercase tracking-widest"
                    >
                        <span className="text-gray-400">Sort by:</span>
                        <span className="font-black">{SORT_OPTIONS.find(o => o.key === currentSort)?.label}</span>
                        <ChevronDown size={14} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isSortOpen && (
                        <>
                            <div className="fixed inset-0 z-20" onClick={() => setIsSortOpen(false)} />
                            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 shadow-xl z-30 py-2 rounded-lg">
                                {SORT_OPTIONS.map((option) => (
                                    <button
                                        key={option.key}
                                        onClick={() => handleSortChange(option.key)}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${currentSort === option.key ? 'font-bold bg-gray-50' : 'hover:bg-gray-50 text-gray-600'}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${isFilterVisible ? 'w-full md:w-64 opacity-100' : 'w-0 opacity-0 md:hidden'}`}
                >
                    <div className="space-y-8 pr-4">
                        {/* Active Filters Summary (Inside Sidebar) */}
                        {activeFilters.length > 0 && (
                            <div className="space-y-3 mb-8 pb-8 border-b border-gray-100">
                                <div className="flex flex-wrap gap-2">
                                    {activeFilters.map(({ key, value }) => {
                                        const filter = filters.find(f => f.id === key);
                                        const filterValue = filter?.values.find(v => v.input === value);
                                        return (
                                            <button
                                                key={`${key}-${value}`}
                                                onClick={() => removeFilter(key, value)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 rounded-full text-[11px] font-bold border border-gray-200 transition-colors group"
                                            >
                                                <span>{filterValue?.label || value}</span>
                                                <X size={12} className="ml-1 text-gray-300 group-hover:text-black" />
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={clearFilters}
                                    className="text-[11px] font-bold underline text-gray-400 hover:text-black transition-colors"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}

                        {filters.map((filter) => (
                            <div key={filter.id} className="border-b border-gray-100 pb-6">
                                <button
                                    onClick={() => toggleFilterAccordion(filter.id)}
                                    className="flex items-center justify-between w-full text-left mb-4 group"
                                >
                                    <span className="text-sm font-bold uppercase tracking-widest text-gray-900 leading-none">
                                        {filter.label}
                                    </span>
                                    {openFilters.includes(filter.id) ? (
                                        <ChevronUp size={16} className="text-gray-400 group-hover:text-black" />
                                    ) : (
                                        <ChevronDown size={16} className="text-gray-400 group-hover:text-black" />
                                    )}
                                </button>

                                {openFilters.includes(filter.id) && (
                                    <div className="space-y-3 animate-fadeIn">
                                        {filter.values.map((value) => {
                                            const isChecked = searchParams.getAll(filter.id).includes(value.input);
                                            return (
                                                <label 
                                                    key={value.id} 
                                                    className="flex items-start gap-3 cursor-pointer group"
                                                >
                                                    <div className="relative flex items-center mt-0.5">
                                                        <input
                                                            type="checkbox"
                                                            className="peer h-4 w-4 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer appearance-none border transition-all checked:bg-black checked:border-black"
                                                            checked={isChecked}
                                                            onChange={(e) => handleFilterChange(filter.id, value.input, e.target.checked)}
                                                        />
                                                        <svg
                                                            className="absolute w-3 h-3 text-white transition-opacity opacity-0 peer-checked:opacity-100 top-0.5 left-0.5 pointer-events-none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                        </svg>
                                                    </div>
                                                    <span className={`text-sm tracking-tight transition-colors ${isChecked ? 'font-bold text-black' : 'text-gray-600 group-hover:text-black'}`}>
                                                        {value.label}
                                                        <span className="ml-1 text-[10px] text-gray-400 font-normal">({value.count})</span>
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    {children}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.15s ease-out forwards;
                }
            `}} />
        </div>
    );
}
