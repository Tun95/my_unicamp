import MoonLoader from "react-spinners/MoonLoader";
import { useTheme } from "../../custom hooks/Hooks";

function LoadingBox() {
  const { theme } = useTheme();
  return (
    <div className="flex justify-center items-center my-1 mb-2.5 min-h-screen relative z-[100]">
      <div className="py-[10px] pb-[30px]">
        <MoonLoader
          size={45}
          color={theme === "light" ? "var(--color-dark)" : "var(--color-white)"}
        />
      </div>
    </div>
  );
}

export default LoadingBox;
