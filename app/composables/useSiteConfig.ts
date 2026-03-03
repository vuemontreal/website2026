export function useSiteConfig() {
  const config = useRuntimeConfig().public
  return {
    contactEmail: (config as any).contactEmail as string,
    siteUrl: (config as any).siteUrl as string,
    social: (config as any).social as Record<string, string>,
    newsletterUrl: (config as any).newsletterUrl as string,
    newsletterEmailField: (config as any).newsletterEmailField as string,
    heroImageUrl: (config as any).heroImageUrl as string,
    communityImageUrl: (config as any).communityImageUrl as string,
  }
}
