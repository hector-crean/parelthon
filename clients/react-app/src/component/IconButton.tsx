import { MouseEventHandler } from "react";
import styles from "./IconButton.module.css";

type Props = {
  onClick: () => void;
  children: React.ReactNode;
  isActive?: boolean;
  disabled?: boolean;
};

export default function IconButton({
  onClick,
  children,
  isActive,
  disabled,
}: Props) {
  const onClickHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onClick();
  };
  return (
    <button
      className={`${styles.button} ${isActive ? styles.button_active : ""}`}
      onClick={onClickHandler}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
