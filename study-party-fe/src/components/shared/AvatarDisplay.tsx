import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"

type AvatarDisplayProps = {
    src?: string;
    fallback?: string;
    alt?: string;
    size?: number;            // px
    position?: string;        // 'center' | 'top' | '50% 30%' ...
    className?: string;
}

const AvatarDisplay = ({
                           src,
                           fallback,
                           alt = "User Avatar",
                           size = 96,
                           position = "center",
                           className = "",
                       }: AvatarDisplayProps) => {
    return (
        <Avatar
            style={{ width: size, height: size }}
            className={`rounded-full overflow-hidden border-2 border-background shadow-md ${className}`}
        >
            <AvatarImage
                src={src}
                alt={alt}
                className="w-full h-full"
                style={{ objectFit: "cover", objectPosition: position }}
            />
            <AvatarFallback className="flex items-center justify-center bg-primary text-primary-foreground font-semibold">
                {fallback?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
        </Avatar>
    );
};

export default AvatarDisplay;
