import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const roles = ["admin", "sysadmin", "user", "guest"]
const users = [{
	firstName: "Jhon",
	lastName: "Doe",
	email: "JhonDoe@email.com",
	password: "JhonDoe*123",
	role: "admin",
}, {
	firstName: "Jane",
	lastName: "Doe",
	email: "JaneDoe@email.com",
	password: "JaneDoe*123",
	role: "sysadmin",
}, {
	firstName: "Jack",
	lastName: "Sparrow",
	email: "JackSparrow@email.com",
	password: "JackSparrow*123",
	role: "user",
}, {
	firstName: "Will",
	lastName: "Smith",
	email: "WillSmith@email.com",
	password: "WillSmith*123",
	role: "guest",
}]

async function main() {

	roles.forEach(async (role) => {
		await prisma.role.upsert({
			where: { name: role },
			update: {},
			create: { name: role },
		})
	})

	users.forEach(async (user) => {
		await prisma.user.upsert({
			where: { email: user.email },
			update: {
				firstName: user.firstName,
				lastName: user.lastName,
				password: user.password,
				role: {
					connect: { name: user.role },
				},
			},
			create: {
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				password: user.password,
				role: {
					connect: { name: user.role },
				},
			},
		})
	}
	)
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})