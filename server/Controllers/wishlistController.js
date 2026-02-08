import User from "../Models/User.js";

// Toggle Wishlist
export const toggleWishlist = async (req, res) => {
    try {
        const { carId } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);

        // Check if already in wishlist
        const index = user.wishlist.indexOf(carId);

        if (index === -1) {
            // Add
            user.wishlist.push(carId);
            await user.save();
            res.json({ success: true, message: "Added to wishlist", wishlist: user.wishlist });
        } else {
            // Remove
            user.wishlist.splice(index, 1);
            await user.save();
            res.json({ success: true, message: "Removed from wishlist", wishlist: user.wishlist });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get User Wishlist
export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("wishlist");
        res.json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
