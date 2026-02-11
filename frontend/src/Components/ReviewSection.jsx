import React, { useEffect, useState } from "react";
import { Star, User, Trash2 } from "lucide-react";
import { addReview, getCarReviews, deleteReview } from "../Services/reviewApi";
import { toast } from "react-toastify";

const ReviewSection = ({ carId, user, onAuthRequire }) => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ total: 0, avg: 0 });
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

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
            if (onAuthRequire) onAuthRequire();
            else toast.error("Please login to write a review");
            return;
        }
        if (!comment.trim()) {
            toast.error("Please share your experience");
            return;
        }

        setSubmitting(true);
        try {
            const res = await addReview({ carId, rating, comment });
            if (res.data.success) {
                toast.success("Thank you for your feedback! ✨");
                setComment("");
                setRating(5);
                setShowForm(false);
                fetchReviews(); // Refresh list
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Delete this review?")) return;
        try {
            await deleteReview(reviewId);
            toast.success("Review removed");
            fetchReviews();
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    const handleWriteReviewClick = () => {
        if (!user) {
            if (onAuthRequire) onAuthRequire();
            else toast.error("Please login to write a review");
        } else {
            setShowForm(!showForm);
        }
    };

    return (
        <div className="space-y-10 max-w-4xl mx-auto">
            {/* Header / Stats */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-gray-100">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 font-display">Client Reviews</h3>
                    <p className="text-gray-500 mt-1">What our community is saying about this vehicle</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-4xl font-black text-gray-900 leading-none">{stats.avg.toFixed(1)}</div>
                        <div className="flex text-yellow-400 text-sm mt-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < Math.round(stats.avg) ? "currentColor" : "none"} />
                            ))}
                        </div>
                    </div>
                    <div className="h-10 w-px bg-gray-200"></div>
                    <div>
                        <div className="text-sm font-bold text-gray-900">{stats.total} Reviews</div>
                        <p className="text-xs text-gray-500">Verified Buyers</p>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-900">
                    {reviews.length > 0 ? `${reviews.length} Experiences` : "No reviews yet"}
                </h4>
                <button
                    onClick={handleWriteReviewClick}
                    className="px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition shadow-lg active:scale-95"
                >
                    {showForm ? "Cancel Review" : "Write a Review"}
                </button>
            </div>

            {/* Review Form */}
            {showForm && (
                <div className="animate-fade-in bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Rate your experience</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="group transition-transform active:scale-90 focus:outline-none"
                                        >
                                            <Star
                                                size={32}
                                                className={`transition-colors ${rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300 group-hover:text-yellow-200"}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Your Feedback</label>
                                <textarea
                                    className="w-full p-4 bg-white border-0 rounded-2xl focus:ring-2 focus:ring-blue-500/10 shadow-sm outline-none transition text-gray-700 placeholder:text-gray-400"
                                    rows="4"
                                    placeholder="What did you like about the car? How was the drive?"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    disabled={submitting}
                                    className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50"
                                >
                                    {submitting ? "Publishing..." : "Post Review"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-8">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="animate-pulse flex gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-300">
                            <Star size={32} />
                        </div>
                        <h5 className="font-bold text-gray-900">Be the first to review</h5>
                        <p className="text-gray-500 text-sm mt-1">Share your experience with this vehicle</p>
                    </div>
                ) : (
                    reviews.map((rev) => (
                        <div key={rev._id} className="group border-b border-gray-100 last:border-0 pb-8 last:pb-0">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    {rev.user?.photo ? (
                                        <img src={rev.user.photo} alt={rev.user.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg border-2 border-white shadow-sm">
                                            {rev.user?.name?.charAt(0) || <User size={20} />}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h5 className="font-bold text-gray-900">{rev.user?.name || "Verified User"}</h5>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex text-yellow-400 text-xs">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} />
                                                    ))}
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                                                    {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>

                                        {(user?._id === rev.userId || user?.role === "admin") && (
                                            <button
                                                onClick={() => handleDelete(rev._id)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                                title="Delete Review"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <p className="text-gray-600 mt-3 text-sm leading-relaxed font-medium">
                                        "{rev.comment}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
