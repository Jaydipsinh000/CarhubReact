import React from 'react';
import { Car } from 'lucide-react';
import { motion } from 'framer-motion';

const CarLoader = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] w-full bg-transparent">
            <div className="relative">
                {/* Road line */}
                <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="w-full h-full bg-blue-500"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Moving Car */}
                <motion.div
                    className="absolute -top-8 left-0 text-blue-600"
                    initial={{ x: 0 }}
                    animate={{ x: 192 }} // Width of the road
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                    <Car size={32} />
                </motion.div>
            </div>

            <motion.p
                className="mt-6 text-gray-500 font-medium font-display tracking-wider"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                STARTING ENGINE...
            </motion.p>
        </div>
    );
};

export default CarLoader;
