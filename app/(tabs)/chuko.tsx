import Matter from 'matter-js'
import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { GameEngine } from 'react-native-game-engine'

const { width, height } = Dimensions.get('window')

const Ball = ({ body, size, color }: any) => {
	const width = size[0]
	const height = size[1]
	const x = body.position.x - width / 2
	const y = body.position.y - height / 2

	return (
		<View
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: width,
				height: height,
				borderRadius: width / 2,
				backgroundColor: color,
			}}
		/>
	)
}

const Basket = ({ body, size, color }: any) => {
	const width = size[0]
	const height = size[1]
	const x = body.position.x - width / 2
	const y = body.position.y - height / 2

	return (
		<View
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: width,
				height: height,
				backgroundColor: color,
			}}
		/>
	)
}

const Physics = (entities: any, { time }: any) => {
	let engine = entities.physics.engine
	Matter.Engine.update(engine, time.delta)
	return entities
}

export default function TabChukoScreen() {
	const engine = Matter.Engine.create({ enableSleeping: false })
	const world = engine.world

	const ball = Matter.Bodies.circle(50, 300, 20, { restitution: 0.7 })
	const basket = Matter.Bodies.rectangle(300, 50, 100, 20, { isStatic: true })

	Matter.World.add(world, [ball, basket])

	return (
		<View style={styles.container}>
			<GameEngine
				systems={[Physics]}
				entities={{
					ball: { body: ball, size: [40, 40], color: 'orange', renderer: Ball },
					basket: {
						body: basket,
						size: [100, 20],
						color: 'red',
						renderer: Basket,
					},
				}}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	bone: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: 'red',
		position: 'absolute',
	},
	chuko: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: 'orange',
		position: 'absolute',
	},
	headerImage: {
		color: '#808080',
		bottom: -90,
		left: -35,
		position: 'absolute',
	},
	titleContainer: {
		flexDirection: 'row',
		gap: 8,
	},
})
