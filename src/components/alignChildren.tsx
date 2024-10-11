import { cn } from "@/lib/utils";

export default function AlignChildren({
    alignment,
    children,
}: {
    alignment:
        | "left"
        | "right"
        | "bottom"
        | "top"
        | "top-left"
        | "top-right"
        | "bottom-left"
        | "bottom-right"
        | "center";
    children: React.ReactNode;
}) {
    let flexOpts = "";
    switch (alignment) {
        case "left":
            flexOpts = "justify-start items-center";
            break;
        case "right":
            flexOpts = "justify-end items-center";
            break;
        case "bottom":
            flexOpts = "justify-center items-end";
            break;
        case "top":
            flexOpts = "justify-center items-start";
            break;
        case "top-left":
            flexOpts = "justify-start items-start";
            break;
        case "top-right":
            flexOpts = "justify-end items-start";
            break;
        case "bottom-left":
            flexOpts = "justify-start items-end";
            break;
        case "bottom-right":
            flexOpts = "justify-end items-end";
            break;
        case "center":
            flexOpts = "justify-center items-center";
            break;
    }

    return <div className={cn("flex w-full h-full", flexOpts)}>{children}</div>;
}
