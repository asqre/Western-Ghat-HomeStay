import React from "react";
import classes from "./style.module.css";

export default function Hero({ title = "Title Me" }) {
  return (
    <div
      className={`${classes.hero} w-full h-[280px] flex justify-center items-center uppercase`}
    >
      <span>{title}</span>
    </div>
  );
}
