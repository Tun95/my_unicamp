interface MessageBoxProps {
  variant?: "info" | "danger" | "success";
  children: React.ReactNode;
}

function MessageBox({ variant = "info", children }: MessageBoxProps) {
  // Base alert classes
  const baseClasses =
    "px-3 py-2 rounded-md font-bold shadow-[1px_2px_2px_-2px]";

  // Variant-specific classes
  const variantClasses = {
    info: "text-[#2020ae] bg-[#e0e0ff] border border-transparent",
    danger:
      "text-[#a02020] bg-[#ffe0e0] border border-transparent flex justify-center items-center",
    success: "text-green-600 bg-lightgreen inline-block",
  };

  return (
    <div className="flex justify-center items-center my-1 mb-2.5">
      <div className={`${baseClasses} ${variantClasses[variant]}`}>
        {children}
      </div>
    </div>
  );
}

export default MessageBox;
