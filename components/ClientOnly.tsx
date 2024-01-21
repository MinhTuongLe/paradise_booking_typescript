"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface ClientOnlyProps {
  children: any;
}

const  ClientOnly:React.FC<ClientOnlyProps> = ({ children }) =>{
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}

export default ClientOnly;
