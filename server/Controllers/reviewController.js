import Review from "../Models/Review.js";
import Car from "../Models/Cars.js"; // Note: File is Cars.js based on previous checks

// Add a new review
export const addReview = async (req, res) => {
    try {
        const { carId, rating, comment } = req.body;
        const userId = req.user._id;

        // Check if user already reviewed this car? (Optional: for now allow multiple)
        // For better UX, we might want to limit to 1 review per booking, but simple is ok for now.

        const newReview = new Review({
            carId,
            userId,
            user: {
                name: req.user.name,
                photo: req.user.photo || "",
            },
            rating,
            comment,
        });

        await newReview.save();

        // Update Car's average rating (Optional optimization: calculate on fly or store in Car)
        // For now, let's just save the review. 
        // If we want to show avg rating on car card, we should probably calculate it.

        res.status(201).json({ success: true, review: newReview });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get reviews for a specific car
export const getCarReviews = async (req, res) => {
    try {
        const { carId } = req.params;
        const reviews = await Review.find({ carId }).sort({ createdAt: -1 });

        // Calculate stats
        const total = reviews.length;
        const avg = total > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / total : 0;

        res.status(200).json({ success: true, reviews, stats: { total, avg } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a review (Admin or Owner)
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findById(id);

        if (!review) return res.status(404).json({ message: "Review not found" });

        // Allow admin or the user who wrote it
        if (req.user.role !== "admin" && review.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await review.deleteOne();
        res.status(200).json({ success: true, message: "Review deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
