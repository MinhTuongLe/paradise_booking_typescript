import React, { ReactElement } from "react";

interface FormItemProps {
  id: string,
  label: string,
  children: ReactElement
}

const FormItem: React.FC<FormItemProps> = ({ id, label, children }) => {
  return (
    <div className="mb-6">
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}

export default FormItem;
