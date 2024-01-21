import React from "react";

function FormItem({ id, label, children }) {
  return (
    <div className="mb-6">
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}

export default FormItem;
