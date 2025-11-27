import AxiosConfig from "../../config/axios.config";

const RESOURCE = "/api/reviews";

export async function createReview(formData) {
  const response = await AxiosConfig.post(RESOURCE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function getRestaurantReviews(restaurantId, page = 1, pageSize = 10) {
  try {
    const response = await AxiosConfig.get(`/api/restaurants/${restaurantId}/reviews`, {
      params: {
        page,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant reviews:", error);
    throw error;
  }
}

export async function getRestaurantAverageRating(restaurantId) {
  try {
    // Get all reviews to calculate accurate average
    // In production, you might want a separate endpoint for this
    const allReviews = await getRestaurantReviews(restaurantId, 1, 1000);
    const items = allReviews.items || allReviews.Items || [];
    
    if (items.length === 0) {
      return 0;
    }
    
    const sum = items.reduce((acc, review) => {
      const rating = review.restaurantRating || review.RestaurantRating || 0;
      return acc + rating;
    }, 0);
    
    return sum / items.length;
  } catch (error) {
    console.error("Error calculating average rating:", error);
    return 0;
  }
}

