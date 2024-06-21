import React, { useEffect, useState, useRef, useCallback } from 'react'
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native'
import { Engine, World, Bodies, Body, Events, Runner } from 'matter-js'
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	runOnJS,
} from 'react-native-reanimated'
import PhysicsComponent from '@/components/chuko/physics'

const { width, height } = Dimensions.get('window')

export default function TabChukoScreen() {
	const [state, setState] = useState<{
		engine: Matter.Engine | null
		world: Matter.World | null
		bodies: { [key: string]: Matter.Body }
	}>({ engine: null, world: null, bodies: {} })

	const engineRef = useRef<Matter.Engine | null>(null)
	const runnerRef = useRef<Matter.Runner | null>(null)
	const bone1Position = useSharedValue({ x: 200, y: 100 })
	const bone2Position = useSharedValue({ x: 250, y: 100 })

	useEffect(() => {
		const { engine, world, bodies } = PhysicsComponent()
		engineRef.current = engine

		setState({ engine, world, bodies })

		// Create and start the Matter Runner
		const runner = Runner.create()
		runnerRef.current = runner
		Runner.run(runner, engine)

		const updateBonePositions = () => {
			bone1Position.value = {
				x: bodies.bone1.position.x,
				y: bodies.bone1.position.y,
			}
			bone2Position.value = {
				x: bodies.bone2.position.x,
				y: bodies.bone2.position.y,
			}
		}

		const interval = setInterval(() => {
			if (engine) {
				runOnJS(updateBonePositions)()
			}
		}, 1000 / 60)

		return () => {
			clearInterval(interval)
			// Stop the runner
			Runner.stop(runner)
			engineRef.current = null
			runnerRef.current = null
		}
	}, [])

	const bone1Style = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateX: bone1Position.value.x },
				{ translateY: bone1Position.value.y },
			],
		}
	})

	const bone2Style = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateX: bone2Position.value.x },
				{ translateY: bone2Position.value.y },
			],
		}
	})

	const createPanResponder = (body: Matter.Body | undefined) => {
		return PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderGrant: () => {
				if (body) {
					Body.setStatic(body, true)
				}
			},
			onPanResponderMove: (_, gesture) => {
				if (body) {
					Body.setPosition(body, { x: gesture.moveX, y: gesture.moveY })
				}
			},
			onPanResponderRelease: (_, gesture) => {
				if (body) {
					Body.setStatic(body, false)
					Body.applyForce(body, body.position, {
						x: gesture.vx * 0.05,
						y: gesture.vy * 0.05,
					})
				}
			},
		})
	}

	const bone1Responder = createPanResponder(state.bodies?.bone1)
	const bone2Responder = createPanResponder(state.bodies?.bone2)

	return (
		<Animated.View style={styles.container}>
			<Animated.View
				{...bone1Responder?.panHandlers}
				style={[styles.bone, bone1Style]}
			/>
			<Animated.View
				{...bone2Responder?.panHandlers}
				style={[styles.bone, bone2Style]}
			/>
		</Animated.View>
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
