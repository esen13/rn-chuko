import Ionicons from '@expo/vector-icons/Ionicons'
import { StatusBar, StyleSheet, View } from 'react-native'

import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

import Matter from 'matter-js'
import { GameEngine } from 'react-native-game-engine'

export default function TabChukoScreen() {
	// Создаем физический мир и его тела
	const engine = Matter.Engine.create({ enableSleeping: false })
	const world = engine.world

	const chuko1 = Matter.Bodies.circle(50, 200, 20, { restitution: 0.7 })
	const chuko2 = Matter.Bodies.circle(150, 200, 20, { restitution: 0.7 })
	const chuko3 = Matter.Bodies.circle(250, 200, 20, { restitution: 0.7 })

	// Создаем границы игрового поля
	const floor = Matter.Bodies.rectangle(200, 400, 400, 20, { isStatic: true })
	const leftWall = Matter.Bodies.rectangle(0, 200, 20, 400, { isStatic: true })
	const rightWall = Matter.Bodies.rectangle(400, 200, 20, 400, {
		isStatic: true,
	})

	Matter.World.add(world, [chuko1, chuko2, chuko3, floor, leftWall, rightWall])

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
			headerImage={
				<Ionicons size={310} name='code-slash' style={styles.headerImage} />
			}
		>
			<ThemedView style={styles.titleContainer}>
				<ThemedText type='title'>CHUKO</ThemedText>
			</ThemedView>
			<StatusBar hidden={true} />
			<GameEngine
				systems={[Physics]}
				entities={{
					physics: { engine: engine, world: world },
					chuko1: {
						body: chuko1,
						size: { width: 40, height: 40 },
						color: 'orange',
						renderer: Chuko,
					},
					chuko2: {
						body: chuko2,
						size: { width: 40, height: 40 },
						color: 'blue',
						renderer: Chuko,
					},
					chuko3: {
						body: chuko3,
						size: { width: 40, height: 40 },
						color: 'green',
						renderer: Chuko,
					},
				}}
			/>
		</ParallaxScrollView>
	)
}

const Chuko = ({ body, size, color }: any) => {
	const { width, height } = size
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
				borderRadius: width / 2,
			}}
		/>
	)
}

// Функция для обновления физического мира
const Physics = (entities: { physics: { engine: any } }, { time }: any) => {
	let engine = entities.physics.engine
	Matter.Engine.update(engine, time.delta)
	return entities
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'red',
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
