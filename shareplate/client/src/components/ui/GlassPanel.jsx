import React from 'react';
import { motion } from 'framer-motion';

export default function GlassPanel({ children, className = '', style }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`glass-dark border border-gray-700/30 ${className}`}
      style={style}
    >
      {children}
    </motion.div>
  );
}
