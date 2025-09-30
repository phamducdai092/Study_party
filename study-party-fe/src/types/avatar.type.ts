export type AvatarDisplayProps = {
    src?: string
    fallback: string
    alt?: string
    size?: number          // px
    fit?: "cover" | "contain"
}