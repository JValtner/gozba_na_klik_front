import React, { useState, useEffect } from "react";
import { useUser } from "../users/UserContext";
import MenuItem from "./menu/menuItem";
import Spinner from "../spinner/Spinner";
import MealFilterSection from "../utils/MealFilterSection";
import SortForm from "../utils/SortForm";
import Pagination from "../utils/Pagination";
import { getSortedFilteredPagedMeals, getSortTypes } from "../service/menuService";
import { Link } from "react-router-dom";


const GeneralMealSearch = () => {
    const { role } = useUser();
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortTypes, setSortTypes] = useState([]);
    const [chosenType, setChosenType] = useState("");
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalItems, setTotalItems] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [pageCount, setPageCount] = useState(0);

    // Filter state
    const [filter, setFilter] = useState({
        Name: null,
        MinPrice: null,
        MaxPrice: null,
        RestaurantName: null,
        Alergens: [],
        Addons: []
    });

    // Load sort types
    useEffect(() => {
        const loadSortTypes = async () => {
            try {
                const data = await getSortTypes();
                setSortTypes(data || []);
            } catch {
                setSortTypes([
                    { key: "PRICE_ASC", name: "Cena rastuće" },
                    { key: "PRICE_DESC", name: "Cena opadajuće" },
                    { key: "A_Z", name: "Naziv A-Z" },
                    { key: "Z_A", name: "Naziv Z-A" }
                ]);
            }
        };
        loadSortTypes();
    }, []);

    // Load meals
    useEffect(() => {
        if (role === "Guest") return; // Don't fetch meals for guests

        const loadData = async () => {
            try {
                setLoading(true);
                const data = await getSortedFilteredPagedMeals(
                    filter,
                    page + 1, // backend is 1-based
                    pageSize,
                    chosenType
                );

                setMeals(data.items || []);
                setTotalItems(data.count || 0);
                setHasNextPage(data.hasNextPage || false);
                setHasPreviousPage(data.hasPreviousPage || false);
                setPageCount(data.totalPages || 1);
            } catch (err) {
                console.error(err);
                setError("Greška pri učitavanju jela.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [filter, page, pageSize, chosenType, role]);

    // Reset to first page on filter change
    useEffect(() => {
        setPage(0);
    }, [filter]);

    return (
        <div className="dashboard">
            <div className="dashboard__container">
                {role === "User" && (
                    <div className="dashboard__controls">
                        <MealFilterSection filter={filter} setFilter={setFilter} />

                        <SortForm
                            sortTypes={sortTypes}
                            chosenType={chosenType}
                            onSortChange={(value) => {
                                setChosenType(value);
                                setPage(0);
                            }}
                        />

                        <Pagination
                            page={page}
                            pageCount={pageCount}
                            totalCount={totalItems}
                            hasPreviousPage={hasPreviousPage}
                            hasNextPage={hasNextPage}
                            pageSize={pageSize}
                            onPageChange={setPage}
                            onPageSizeChange={setPageSize}
                        />
                    </div>
                )}

                {error && <p className="error-message">{error}</p>}

                <div className="dashboard__grid">
                    {loading ? (
                        <Spinner />
                    ) : meals.length === 0 ? (
                        <div className="dashboard__empty">
                            <h2>Nema dostupnih jela</h2>
                            <p>Trenutno nema raspolozivih jela.</p>
                        </div>
                    ) : (
                        meals.map((meal) =>
                            <Link
                                key={meal.id}
                                to={`/restaurants/${meal.restaurant.id}/menu?highlight=${meal.id}`}
                                className="dashboard__card restaurant-card-link"
                            >
                                <MenuItem meal={meal} />
                            </Link>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default GeneralMealSearch;
