"user client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";

interface FooterColumnProps {
  index: number;
  data: string[];
}

const FooterColumn: React.FC<FooterColumnProps> = ({ index, data }) => {
  const { t } = useTranslation("translation", { i18n });

  const columnItems = data.map((item, index) =>
    index === 0 ? (
      <h5 className="font-bold" key={index}>
        {t(`footer.${item}`)}
      </h5>
    ) : (
      <p key={index}>{t(`footer.${item}`)}</p>
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
};

export default FooterColumn;
