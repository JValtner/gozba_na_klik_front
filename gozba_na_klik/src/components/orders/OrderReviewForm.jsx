import React, { useState } from 'react';

const OrderReviewForm = ({ order }) => {
    const [rating, setRating] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Perform a POST request to your backend to save the review
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                order_id: order.id,
                restaurant_rating: rating,
                photo,
                comment,
                courier_rating: null, // Add courier rating if applicable
                courier_comment: null, // Add courier comment if applicable
            }),
        });

        if (!response.ok) {
            // Handle error
        }

        // Reset form fields
        setRating(null);
        setPhoto(null);
        setComment('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Restaurant Rating:
                <input
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                />
            </label>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
            />
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit">Submit Review</button>
        </form>
    );
};

export default OrderReviewForm;