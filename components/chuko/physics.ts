// Physics.js
import { Engine, Render, World, Bodies, Body } from 'matter-js'

const PhysicsComponent = () => {
	const engine = Engine.create({ enableSleeping: false })
	const world = engine.world

	// Create a ground
	const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true })

	// Add bones (Alchiks) - in a real game you would need more detailed bodies
	const bone1 = Bodies.circle(400, 200, 20)
	const bone2 = Bodies.circle(450, 200, 20)

	// Add all of the bodies to the world
	World.add(world, [ground, bone1, bone2])

	return {
		engine,
		world,
		bodies: { ground, bone1, bone2 },
	}
}

export default PhysicsComponent
