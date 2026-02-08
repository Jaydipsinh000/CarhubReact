import React, { useEffect, useState } from "react";
import { Star, User, Trash2 } from "lucide-react";
import { addReview, getCarReviews, deleteReview } from "../Services/reviewApi";
import { toast } from "react-toastify";

const ReviewSection = ({ carId, user }) => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ total: 0, avg: 0 });
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [carId]);

    const fetchReviews = async () => {
        try {
            const res = await getCarReviews(carId);
            if (res.data.success) {
                setReviews(res.data.reviews);
                setStats(res.data.stats);
            }
        } catch (error) {
            console.error("Error fetching reviews", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to write a review");
            return;
        }
        if (!comment.trim()) {
            toast.error("Please write a comment");
            return;
        }

        setSubmitting(true);
        try {
            const res = await addReview({ carId, rating, comment });
            if (res.data.success) {
                toast.success("Review submitted!");
                setComment("");
                setRating(5);
                fetchReviews(); // Refresh list
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await deleteReview(reviewId);
            toast.success("Review deleted");
            fetchReviews();
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold font-display mb-6 flex items-center gap-3">
                Client Reviews
                <span className="text-sm font-normal bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                    {stats.total} reviews
                </span>
            </h3>

            {/* Stats Summary */}
            {stats.total > 0 && (
                <div className="flex items-center gap-4 mb-8 bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-gray-900">{stats.avg.toFixed(1)}</span>
                        <div className="flex text-yellow-400 mb-1.5">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={18} fill={i < Math.round(stats.avg) ? "currentColor" : "none"} />
                            ))}
                        </div>
                    </div>
                    <p className="text-sm text-gray-500">Overall Rating Based on {stats.total} users</p>
                </div>
            )}

            {/* Review Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h4 className="font-bold mb-4">Write a Review</h4>

                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-500 uppercase mb-2">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`transition-transform hover:scale-110 ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                                >
                                    <Star size={24} fill={rating >= star ? "currentColor" : "none"} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-500 uppercase mb-2">Comment</label>
                        <textarea
                            className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                            rows="3"
                            placeholder="Share your experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </div>

                    <button
                        disabled={submitting}
                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition active:scale-95 disabled:opacity-50"
                    >
                        {submitting ? "Posting..." : "Post Review"}
                    </button>
                </form>
            ) : (
                <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100 text-center">
                    <p className="text-blue-800 font-medium">Please login to write a review.</p>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {loading ? (
                    <p>Loading reviews...</p>
                ) : reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No reviews yet. Be the first!</p>
                ) : (
                    reviews.map((rev) => (
                        <div key={rev._id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    {rev.user?.photo ? (
                                        <img src={rev.user.photo} alt={rev.user.name} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                            <User size={20} />
                                        </div>
                                    )}
                                    <div>
                                        <h5 className="font-bold text-gray-900">{rev.user?.name || "Anonymous"}</h5>
                                        <div className="flex text-yellow-400 text-xs mt-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Delete Button (Owner or Admin) */}
                                {(user?._id === rev.userId || user?.role === "admin") && (
                                    <button
                                        onClick={() => handleDelete(rev._id)}
                                        className="text-gray-300 hover:text-red-500 transition"
                                        title="Delete Review"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-600 pl-[52px] text-sm leading-relaxed">{rev.comment}</p>
                            <p className="text-xs text-gray-400 pl-[52px] mt-2">{new Date(rev.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
