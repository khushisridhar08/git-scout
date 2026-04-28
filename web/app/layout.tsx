import "./globals.css"
import "./custom.css"
import type { Metadata } from "next"
import { Toaster } from "@/components/toasts/Toaster"
import { APP_CONFIG } from "@/config"
import { GeistMono, GeistSans } from "@/fonts/fonts"
import { AuthProvider } from "@/providers/AuthProvider"
import ReactQueryProvider from "@/providers/ReactQueryProvider"
import { cn } from "@/utils/cn"

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
		<html
			lang="en"
			className={cn("dark", GeistSans.variable, GeistMono.variable)}
		>
			<body className="font-sans antialiased bg-background text-foreground">
				<ReactQueryProvider>
					<AuthProvider>{children}</AuthProvider>
				</ReactQueryProvider>
				<Toaster />
			</body>
		</html>
	)
}
