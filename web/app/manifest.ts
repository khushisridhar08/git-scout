import type { MetadataRoute } from "next"
import { APP_CONFIG } from "@/config"

export default function manifest(): MetadataRoute.Manifest {
	return {
		background_color: "#000000",
		description: APP_CONFIG.DESCRIPTION,
		display: "standalone",
		icons: [
			{
				src: "/favicon.ico",
				sizes: "any",
				type: "image/x-icon",
			},
		],
		name: APP_CONFIG.NAME,
		short_name: APP_CONFIG.NAME,
		start_url: "/",
		theme_color: "#000000",
	}
}
