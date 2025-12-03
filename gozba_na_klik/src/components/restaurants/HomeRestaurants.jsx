import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../users/UserContext";
import {
  getSortedFilteredPagedRestaurants,
  getSortTypes,
  getTop5Restaurants,
} from "../service/restaurantsService";
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
  const [restaurants, setRestaurants] = useState([]);
  const [top5Restaurants, setTop5Restaurants] = useState([]);
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
  const [filter, setFilter] = useState({ Name: null, Address: null });
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const loadSortTypes = async () => {
      try {
        const data = await getSortTypes();
        setSortTypes(data || []);
      } catch (err) {
        console.error("Greška pri učitavanju tipova sortiranja:", err.message);
        setSortTypes([
          { key: "A_Z", name: "Naziv A-Z" },
          { key: "Z_A", name: "Naziv Z-A" },
        ]);
      }
    };
    loadSortTypes();
  }, []);

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
        const dataTop5 = await getTop5Restaurants();
        setTop5Restaurants(dataTop5 || []);
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

  return (
    <div className="dashboard">
      <div className="dashboard__container">
       {/* Filter + Sort */}
        {role === "User" && (
          <div className="dashboard__controls">
            <RestaurantFilterSection filter={filter} setFilter={setFilter} />
            <SortForm
              sortTypes={sortTypes}
              chosenType={chosenType}
              onSortChange={(value) => {
                setChosenType(value);
                setPage(0);
              }}
            />
          </div>
        )}

        {/* Error */}
        {error && <p className="error-message">{error}</p>}
        <div className="best-rated-section">
          <h3>Najbolje ocenjeni restorani</h3>
          <hr />
        </div>
        <div className="dashboard__grid">
          {loading ? (
            <Spinner />
          ) : top5Restaurants.length === 0 ? (
            <div className="dashboard__empty">
              <h2>Nema dostupnih ocenjenih restorana</h2>
            </div>
          ) : (
            top5Restaurants.map((r5) => (
              <RestaurantBuyerCard key={r5.id} restaurant={r5} />
            ))
          )}
        </div>

        {/* Restaurant Grid */}
        <div className="best-rated-section">
          <h3>Kompletna ponuda restorana</h3>
          <hr />
        </div>
        <div className="dashboard__grid">
          {loading ? (
            <Spinner />
          ) : restaurants.length === 0 ? (
            <div className="dashboard__empty">
              <h2>Nema dostupnih restorana</h2>
              <p>Trenutno nema restorana koji su otvoreni.</p>
            </div>
          ) : (
            restaurants.map((r) => (
              <RestaurantBuyerCard key={r.id} restaurant={r} />
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {role === "User" && (
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
        )}
      </div>
    </div>
  );
};

export default HomeRestaurants;
