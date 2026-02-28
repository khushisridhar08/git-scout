import "./globals.css"
import "./custom.css"
import { cn } from "@/utils/cn"
import { APP_CONFIG } from "@/config"
import type { Metadata } from "next"
import { GeistSans, GeistMono } from "@/fonts/fonts"
import { Toaster } from "@/components/toasts/Toaster"
import ReactQueryProvider from "@/providers/ReactQueryProvider"

export const metadata: Metadata = {
	title: APP_CONFIG.NAME,
	description: APP_CONFIG.DESCRIPTION,
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" className={cn(GeistSans.variable, GeistMono.variable)}>
			<body className="font-sans antialiased bg-background text-foreground">
				<ReactQueryProvider>{children}</ReactQueryProvider>
				<Toaster />
			</body>
		</html>
	)
}
