"user client";

import { motion } from "framer-motion";

function FooterColumn({ index, data }) {
  const columnItems = data.map((item, index) =>
    index === 0 ? (
      <h5 className="font-bold" key={index}>
        {item}
      </h5>
    ) : (
      <p key={index}>{item}</p>
    )
  );

  return (
    <motion.div
      initial={{
        x: index % 2 === 0 ? -200 : 200,
        opacity: 0,
      }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="space-y-4 text-xs text-gray-800 cursor-pointer"
    >
      {columnItems}
    </motion.div>
  );
}

export default FooterColumn;
