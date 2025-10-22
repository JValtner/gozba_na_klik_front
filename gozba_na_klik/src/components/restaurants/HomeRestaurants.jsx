import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../users/UserContext";
import { getSortedFilteredPagedRestaurants, getSortTypes } from "../service/restaurantsService";
import Spinner from "../spinner/Spinner";
import Pagination from "../utils/Pagination";
import SortForm from "../utils/SortForm";
import RestaurantFilterSection from "../utils/RestaurantFilterSection";
import { baseUrl } from "../../config/routeConfig";
import WelcomePage from "../welcome/WelcomePage";
import RestaurantBuyerCard from "../restaurants/RestauranBuyerCard";

const HomeRestaurants = () => {
  const navigate = useNavigate();
  const { userId, role } = useUser();
  // State
  const [restaurants, setRestaurants] = useState([]);
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
  const [filter, setFilter] = useState({
    Name: null,
    Address: null
  });

  // Load sort types and user role
  useEffect(() => {
    const loadSortTypes = async () => {
      try {
        const data = await getSortTypes();
        setSortTypes(data || []);
      } catch (err) {
        console.error("Greška pri učitavanju tipova sortiranja:", err.message);
        setSortTypes([
          { key: "A_Z", name: "Naziv A-Z" },
          { key: "Z_A", name: "Naziv Z-A" }
        ]);
      }
    };
    loadSortTypes();
  }, []);

  // Load restaurants
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getSortedFilteredPagedRestaurants(
          filter,
          page + 1,
          pageSize,
          chosenType
        );

        setRestaurants(data.items || []);
        setTotalItems(data.count || 0);
        setHasNextPage(data.hasNextPage || false);
        setHasPreviousPage(data.hasPreviousPage || false);
        setPageCount(data.totalPages || 1);
      } catch (err) {
        console.error(err);
        setError("Greška pri učitavanju restorana.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filter, page, pageSize, chosenType]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("sr-RS");

  const handleMenu = (id) => {
    navigate(`/restaurants/${id}/menu`);
  };

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        {role === "Guest" && (
          <div className="guest-welcome-wrapper">
            <WelcomePage />
          </div>
        )}

        {/* Filter + Sort */}
        <div className="dashboard__controls">
          {role === "Buyer" && (
            <>
              <RestaurantFilterSection filter={filter} setFilter={setFilter} />

              <SortForm
                sortTypes={sortTypes}
                chosenType={chosenType}
                onSortChange={(value) => {
                  setChosenType(value);
                  setPage(0);
                }}
              />
            </>
          )}

          {/* Pagination Controls */}
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
        {/* Error */}
        {error && <p className="error-message">{error}</p>}

        {/* Restaurant Grid */}
        <div className="dashboard__grid">
          {loading ? (
            <Spinner />
          ) : restaurants.length === 0 ? (
            <div className="dashboard__empty">
              <h2>Nema dostupnih restorana</h2>
              <p>Trenutno nema unetih restorana u sistem.</p>
            </div>
          ) : (
            restaurants.map((r) => (
              <RestaurantBuyerCard key={r.id} restaurant={r} />
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default HomeRestaurants;