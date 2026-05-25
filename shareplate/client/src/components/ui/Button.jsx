import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
};

export default function Button({ children, variant = 'primary', className = '', onClick, ...props }) {
  const base = variants[variant] || variants.primary;
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onClick={onClick}
      className={`${base} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
