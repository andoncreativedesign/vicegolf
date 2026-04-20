import { useLocation, useNavigate, useSearchParams, useNavigation } from 'react-router';
import { useState, ReactNode, useEffect, useMemo } from 'react';
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
    const navigation = useNavigation();

    // Optimistic search params for immediate UI feedback during transitions
    const optimisticSearchParams = useMemo(() => {
        if (navigation.location) {
            return new URLSearchParams(navigation.location.search);
        }
        return searchParams;
    }, [navigation.location, searchParams]);

    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [openFilters, setOpenFilters] = useState<string[]>(filters.map(f => f.id));
    const [persistentProductTypes, setPersistentProductTypes] = useState<FilterValue[]>([]);
    const [ptFilterId, setPtFilterId] = useState<string | null>(null);

    const activeFilters = useMemo(() => {
        return Array.from(optimisticSearchParams.entries())
            .filter(([key]) => key.startsWith('filter.'))
            .map(([key, value]) => ({ key, value }));
    }, [optimisticSearchParams]);

    const currentSort = optimisticSearchParams.get('sort') || 'featured';

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

    useEffect(() => {
        if (isFilterVisible && typeof window !== 'undefined' && window.innerWidth < 768) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            if (typeof document !== 'undefined') {
                document.body.style.overflow = 'unset';
            }
        };
    }, [isFilterVisible]);

    const clearFilters = () => {
        const newParams = new URLSearchParams(searchParams);
        Array.from(newParams.keys()).forEach((key) => {
            if (key.startsWith('filter.')) {
                newParams.delete(key);
            }
        });
        navigate(`${location.pathname}?${newParams.toString()}`, { replace: true, preventScrollReset: true });
    };

    // Persist product types so tabs don't disappear when one is selected
    useEffect(() => {
        const pt = filters.find(f => f.label.toLowerCase() === 'product type');
        if (pt) {
            setPtFilterId(pt.id);
            if (pt.values.length >= persistentProductTypes.length) {
                setPersistentProductTypes(pt.values);
            }
        }
    }, [filters, persistentProductTypes]);

    // Sync open filters when filter set changes and ensure active filters are open
    useEffect(() => {
        if (filters.length > 0) {
            setOpenFilters(prev => {
                const currentIds = filters.map(f => f.id);
                
                // Identify filters that have active values in the URL
                const activeFilterIds = filters
                    .filter(f => optimisticSearchParams.has(f.id))
                    .map(f => f.id);
                
                // Identify new filters that we haven't seen in this session yet
                // (This helps open them all on initial load/refresh)
                const isInitialLoad = prev.length === 0;
                const newFilterIds = isInitialLoad 
                    ? currentIds 
                    : currentIds.filter(id => !prev.includes(id));

                if (newFilterIds.length > 0 || activeFilterIds.some(id => !prev.includes(id))) {
                    return Array.from(new Set([...prev, ...newFilterIds, ...activeFilterIds]));
                }
                return prev;
            });
        }
    }, [filters, optimisticSearchParams]);

    useEffect(() => {
        setPersistentProductTypes([]);
        setPtFilterId(null);
        // We removed setOpenFilters([]) from here to prevent closing them on every navigation
        // unless it's a completely different route structure
        setIsFilterVisible(false);
        setIsSortOpen(false);
    }, [location.pathname]);

    const productTypeFilter = filters.find(f => f.label.toLowerCase() === 'product type');
    const sidebarFilters = filters.filter(f => f.label.toLowerCase() !== 'product type');

    // Use persistent types if available, otherwise current types
    const displayPtValues = persistentProductTypes.length > 0 ? persistentProductTypes : (productTypeFilter?.values || []);
    const targetId = ptFilterId || productTypeFilter?.id;

    return (
        <div className="w-full">
            {/* Product Type Tabs */}
            {targetId && displayPtValues.length > 1 && (
                <nav className="mb-8 border-b border-gray-100 overflow-x-auto no-scrollbar -mx-[1rem] px-[1rem]">
                    <div className="flex gap-10 min-w-max">
                        <button
                            onClick={() => {
                                const newParams = new URLSearchParams(searchParams);
                                newParams.delete(targetId);
                                navigate(`${location.pathname}?${newParams.toString()}`, { replace: true, preventScrollReset: true });
                            }}
                            className={`pb-4 text-[14px] font-bold transition-all relative ${!optimisticSearchParams.get(targetId) ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                        >
                            All
                            {!optimisticSearchParams.get(targetId) && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black animate-slideIn" />
                            )}
                        </button>
                        {displayPtValues.map((value) => {
                            const isChecked = optimisticSearchParams.getAll(targetId).includes(value.input);
                            return (
                                <button
                                    key={value.id}
                                    onClick={() => {
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.delete(targetId);
                                        if (!isChecked) {
                                            newParams.set(targetId, value.input);
                                        }
                                        newParams.delete('cursor');
                                        newParams.delete('direction');
                                        navigate(`${location.pathname}?${newParams.toString()}`, { replace: true, preventScrollReset: true });
                                    }}
                                    className={`pb-4 text-[14px] font-bold transition-all relative ${isChecked ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                                >
                                    {value.label}
                                    {isChecked && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black animate-slideIn" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </nav>
            )}
            {/* Top Toolbar */}
            <div className="flex items-center justify-between py-6 border-b border-gray-100 mb-8 sticky top-0 bg-[var(--main-bg-color)] z-10 mx-[-1rem] px-[1rem]">
                <button
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                    className="flex items-center gap-3 text-xs font-black hover:text-gray-600 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal size={16} />
                        <span>{isFilterVisible ? 'Hide filters' : 'Show filters'}</span>
                    </div>
                    {activeFilters.length > 0 && (
                        <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-black text-white text-[10px] font-bold animate-fadeIn">
                            {activeFilters.length}
                        </span>
                    )}
                </button>

                <div className="relative">
                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="flex items-center gap-1 text-xs font-medium hover:text-gray-600 transition-colors tracking-wide"
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
                {/* Mobile Backdrop */}
                {isFilterVisible && (
                    <div 
                        className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300 ease-in-out"
                        onClick={() => setIsFilterVisible(false)}
                    />
                )}

                {/* Sidebar / Drawer Filters */}
                <div 
                    className={`
                        fixed md:relative bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:right-auto
                        z-50 md:z-0
                        bg-[var(--main-bg-color)] md:bg-transparent
                        w-full md:w-[280px]
                        transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                        ${isFilterVisible 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-full md:translate-y-0 md:w-0 opacity-0 md:hidden'}
                    `}
                >
                    <div className="h-[85vh] md:h-auto flex flex-col md:block rounded-t-[2rem] md:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-none overflow-hidden md:overflow-visible">
                        {/* Mobile Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 md:hidden bg-[var(--main-bg-color)]">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal size={18} />
                                <h2 className="text-sm font-black tracking-wide">Filters</h2>
                            </div>
                            <button 
                                onClick={() => setIsFilterVisible(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-0 md:pr-4 space-y-8">
                            {/* Active Filters Summary (Inside Sidebar/Drawer) */}
                            {activeFilters.length > 0 && (
                                <div className="space-y-4 mb-4 pb-8 border-b border-gray-100">
                                    <h3 className="text-[10px] font-black text-gray-400">Active Filters</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {activeFilters.map(({ key, value }) => {
                                            const filter = filters.find(f => f.id === key);
                                            const filterValue = filter?.values.find(v => v.input === value);
                                            
                                            let label = filterValue?.label;
                                            if (!label) {
                                                try {
                                                    const parsed = JSON.parse(value);
                                                    if (parsed.variantOption) {
                                                        label = parsed.variantOption.value;
                                                    } else if (parsed.productMetafield) {
                                                        label = parsed.productMetafield.value;
                                                    } else if (parsed.productType) {
                                                        label = parsed.productType;
                                                    } else if (parsed.tag) {
                                                        label = parsed.tag;
                                                    } else {
                                                        label = value;
                                                    }
                                                } catch {
                                                    label = value;
                                                }
                                            }

                                            return (
                                                <button
                                                    key={`${key}-${value}`}
                                                    onClick={() => removeFilter(key, value)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-full text-[11px] font-bold border border-gray-100 shadow-sm transition-all active:scale-95 group"
                                                >
                                                    <span>{label}</span>
                                                    <X size={12} className="text-gray-300 group-hover:text-black" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button
                                        onClick={clearFilters}
                                        className="text-[11px] font-bold text-gray-400 hover:text-black transition-colors"
                                    >
                                        Clear all
                                    </button>
                                </div>
                            )}

                            {sidebarFilters.map((filter) => (
                                <div key={filter.id} className="border-b border-gray-100 pb-6">
                                    <button
                                        onClick={() => toggleFilterAccordion(filter.id)}
                                        className="flex items-center justify-between w-full text-left mb-4 group"
                                    >
                                        <span className="text-sm font-bold text-gray-900 leading-none">
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
                                                const isChecked = optimisticSearchParams.getAll(filter.id).includes(value.input);
                                                return (
                                                    <label 
                                                        key={value.id} 
                                                        className="flex items-center gap-3 cursor-pointer group py-0.5"
                                                    >
                                                        <div className="relative flex items-center justify-center h-5 w-5 shrink-0">
                                                            <input
                                                                type="checkbox"
                                                                className="peer h-full w-full rounded-[4px] border-gray-300 text-black focus:ring-0 accent-black cursor-pointer appearance-none border transition-all checked:bg-black checked:border-black hover:border-black"
                                                                checked={isChecked}
                                                                onChange={(e) => handleFilterChange(filter.id, value.input, e.target.checked)}
                                                            />
                                                            <svg
                                                                className="absolute w-3 h-3 text-white transition-opacity opacity-0 peer-checked:opacity-100 pointer-events-none"
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
                                                        <div className="flex items-baseline justify-between w-full">
                                                            <span className={`text-sm tracking-tight transition-colors leading-tight ${isChecked ? 'font-bold text-black' : 'text-gray-600 group-hover:text-black'}`}>
                                                                {value.label}
                                                            </span>
                                                            <span className="ml-2 text-[10px] text-gray-400 font-medium tabular-nums">({value.count})</span>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Mobile Footer Area */}
                        <div className="p-6 border-t border-gray-100 md:hidden bg-white">
                            <button 
                                onClick={() => setIsFilterVisible(false)}
                                className="w-full h-14 bg-black text-white text-xs font-black tracking-[0.1em] rounded-xl hover:bg-gray-900 transition-colors"
                            >
                                Show Results
                            </button>
                        </div>
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
                @keyframes slideIn {
                    from { transform: scaleX(0); opacity: 0; }
                    to { transform: scaleX(1); opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.15s ease-out forwards;
                }
                .animate-slideIn {
                    animation: slideIn 0.2s ease-out forwards;
                    transform-origin: left;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </div>
    );
}
