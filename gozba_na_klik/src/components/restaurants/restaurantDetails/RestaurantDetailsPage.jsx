import React, { useState } from 'react';

const RestaurantDetailsPage = ({ restaurantId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5; // Number of reviews to display per page

    const { data, loading, error } = useQuery(GET_REVIEWS, {
        variables: { restaurantId, page: currentPage },
    });

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    const reviews = data.reviews;
    const restaurant = data.restaurant;

    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    const currentReviews = reviews.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div>
            <h1>{restaurant.name}</h1>
            <p>Average rating: {restaurant.averageRating}</p>
            <OrderReviewForm order={order} />
            <h2>Recent Reviews</h2>
            <ul>
                {currentReviews.map((review) => (
                    <Review key={review.id} review={review} />
                ))}
            </ul>
            <div>
                <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={index + 1 === currentPage ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default RestaurantDetailsPage;