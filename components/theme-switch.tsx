"use client";
import { SwitchProps, useSwitch } from "@heroui/switch";
import { useIsSSR } from "@react-aria/ssr";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { FC, useCallback, useEffect, useState } from "react";

import { MoonFilledIcon, SunFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
    className?: string;
    classNames?: SwitchProps["classNames"];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
    className,
    classNames,
}) => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const isSSR = useIsSSR();
    const [mounted, setMounted] = useState(false);

    // After mounting, we can access the theme
    useEffect(() => {
        setMounted(true);
    }, []);

    const onChange = useCallback(() => {
        setTheme(resolvedTheme === "light" ? "dark" : "light");
    }, [resolvedTheme, setTheme]);

    // Determine if the light mode is active
    const isLightMode = !mounted || isSSR ? false : resolvedTheme === "light";

    const {
        Component,
        slots,
        isSelected,
        getBaseProps,
        getInputProps,
        getWrapperProps,
    } = useSwitch({
        isSelected: isLightMode,
        "aria-label": `Switch to ${isLightMode ? "dark" : "light"} mode`,
        onChange,
    });

    // Don't render anything until mounted to avoid hydration mismatch
    if (!mounted) {
        return null;
    }

    return (
        <Component
            {...getBaseProps({
                className: clsx(
                    "px-px transition-opacity hover:opacity-80 cursor-pointer",
                    className,
                    classNames?.base,
                ),
            })}
        >
            <VisuallyHidden>
                <input {...getInputProps()} />
            </VisuallyHidden>
            <div
                {...getWrapperProps()}
                className={slots.wrapper({
                    class: clsx(
                        [
                            "w-auto h-auto",
                            "bg-transparent",
                            "rounded-lg",
                            "flex items-center justify-center",
                            "group-data-[selected=true]:bg-transparent",
                            "!text-default-500",
                            "pt-px",
                            "px-0",
                            "mx-0",
                        ],
                        classNames?.wrapper,
                    ),
                })}
            >
                {isLightMode ? (
                    <SunFilledIcon size={22} />
                ) : (
                    <MoonFilledIcon size={22} />
                )}
            </div>
        </Component>
    );
};
