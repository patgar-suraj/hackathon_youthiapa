import clsx from "clsx";
import { GiSupersonicBullet } from "react-icons/gi";

// const bullet = <GiSupersonicBullet />

const Button = ({ id, title, rightIcon, leftIcon, containerClass, bullet }) => {
  return (
    <button
      id={id}
      className={clsx(
        "group relative z-10 w-fit overflow-hidden rounded-full bg-violet-50 px-7 py-3 text-black",
        // Explicitly remove cursor-pointer by not including it here or in containerClass
        containerClass
      )}
      style={{ cursor: "none" }}
    >
      {leftIcon}

      <span className="relative inline-flex overflow-hidden justify-center items-center font-squid text-xs uppercase gap-1">
        <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
          {title}
        </div>
        <div className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
          {title}
        </div>

        <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
          {bullet}
        </div>
      </span>

      {rightIcon}
      
    </button>
  );
};

export default Button;