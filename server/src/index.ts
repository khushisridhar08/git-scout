import { createApp } from "./app"

const app = createApp().listen(process.env.PORT || 3001)

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
)
console.log(
	`📚 Swagger docs at http://${app.server?.hostname}:${app.server?.port}/swagger`,
)
