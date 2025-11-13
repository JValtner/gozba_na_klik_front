import React, { useState, useEffect } from "react";
import { useUser } from "../users/UserContext";
import MenuItem from "../restaurants/menu/MenuItem";
import Spinner from "../spinner/Spinner";
import MealFilterSection from "../utils/MealFilterSection";
import SortForm from "../utils/SortForm";
import Pagination from "../utils/Pagination";
import { getSortedFilteredPagedMeals, getSortTypes } from "../service/menuService";
import { useNavigate } from "react-router-dom";
import { getCart } from "../orders/AddToCart";


const GeneralMealSearch = () => {
    const { role } = useUser();
    const navigate = useNavigate();
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
    const [floatingCartRestaurantId, setFloatingCartRestaurantId] = useState(null);
    const [floatingCartCount, setFloatingCartCount] = useState(0);

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

    useEffect(() => {
        const updateFloatingCart = () => {
            const lastId = localStorage.getItem("last_cart_restaurant_id");
            if (!lastId) {
                setFloatingCartRestaurantId(null);
                setFloatingCartCount(0);
                return;
            }
            const cart = getCart(lastId);
            const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
            setFloatingCartRestaurantId(Number(lastId));
            setFloatingCartCount(count);
        };
        updateFloatingCart();
        const i = setInterval(updateFloatingCart, 1500);
        return () => clearInterval(i);
    }, []);

    

    return (
        <div className="dashboard">
            <div className="dashboard__container">
                {floatingCartRestaurantId && floatingCartCount > 0 && (
                    <div
                        style={{
                            position: 'sticky',
                            top: 0,
                            zIndex: 1000,
                            paddingTop: '8px',
                            marginBottom: '12px',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            background: 'linear-gradient(to bottom, rgba(249,250,251,1), rgba(249,250,251,0))'
                        }}
                    >
                        <button
                            onClick={() => navigate(`/restaurants/${floatingCartRestaurantId}/order-summary`)}
                            aria-label="Idi u korpu"
                            className="cart-top-btn"
                            style={{
                                background: '#ea580c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '9999px',
                                padding: '10px 14px',
                                fontWeight: 700,
                                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                                cursor: 'pointer'
                            }}
                        >
                            🛒 {floatingCartCount}
                        </button>
                    </div>
                )}
                {role === "Buyer" && (
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
                        meals.map((meal) => (
                            <div
                                key={meal.id}
                                className="dashboard__card restaurant-card-link"
                                onClick={() => navigate(`/restaurants/${meal.restaurant.id}/menu?highlight=${meal.id}`)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        navigate(`/restaurants/${meal.restaurant.id}/menu?highlight=${meal.id}`);
                                    }
                                }}
                            >
                                <MenuItem meal={meal} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default GeneralMealSearch;
