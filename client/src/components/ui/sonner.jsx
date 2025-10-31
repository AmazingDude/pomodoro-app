import { useTheme } from "@/contexts/ThemeContext";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { currentTheme } = useTheme();

  return (
    <Sonner
      theme={currentTheme === "midnight" ? "dark" : "light"}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description:
            "group-[.toast]:text-foreground group-[.toast]:opacity-80",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-text",
          cancelButton:
            "group-[.toast]:bg-secondary group-[.toast]:text-secondary-text",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
