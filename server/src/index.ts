import { cors } from "@elysiajs/cors"
import { swagger } from "@elysiajs/swagger"
import { Elysia } from "elysia"
import { candidatesRoutes } from "./routes/candidates"
import { healthRoutes } from "./routes/health"
import { searchRoutes } from "./routes/search"
import { shortlistsRoutes } from "./routes/shortlists"
import { usersRoutes } from "./routes/users"

const app = new Elysia()
	.use(
		cors({
			origin: process.env.CORS_ORIGIN || "http://localhost:3000",
			credentials: true,
		}),
	)
	.use(
		swagger({
			documentation: {
				info: {
					title: "GitScout API",
					version: "1.0.0",
					description:
						"GitHub talent intelligence API for search, candidate profiles, and shortlists.",
				},
			},
		}),
	)
	.use(healthRoutes)
	.use(usersRoutes)
	.use(searchRoutes)
	.use(candidatesRoutes)
	.use(shortlistsRoutes)
	.listen(process.env.PORT || 3001)

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
)
console.log(
	`📚 Swagger docs at http://${app.server?.hostname}:${app.server?.port}/swagger`,
)

export type App = typeof app
