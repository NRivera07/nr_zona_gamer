type SpinnerSize = "sm" | "md" | "lg" | "full";

type SpinnerProps = {
  size?: SpinnerSize;
};

export function Spinner({ size = "md" }: SpinnerProps) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-4",
    full: "w-16 h-16 border-4",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`
          ${sizes[size]}
          border-white/30 
          border-t-purple-500 
          rounded-full 
          animate-spin
        `}
      />
    </div>
  );
}
