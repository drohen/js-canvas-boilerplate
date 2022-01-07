import bind from "bind-decorator"
import { MouseInput, MouseInputEvent, TouchInput, UserInputEvent } from "./system/inputSystem"
import { UICanvas } from "./UI/uiCanvas"
import { last } from "./util/helpers"

enum State
{
	drawing = `drawing`,
	done = `done`
}

export class Render implements Observer<UserInputEvent | UpdateLoop>
{
	private time: number

	private lines: [number, number][][]

	private lineState: State[]

	private handleMouse: Record<MouseInput, ( data: MouseEvent ) => void>

	private handleTouch: Record<TouchInput, ( data: TouchEvent ) => void>

	private mouseType: MouseInput[]

	constructor()
	{
		this.time = 0

		this.lines = []

		this.lineState = []

		this.mouseType = Object.values( MouseInput )

		this.handleMouse = {
			[ MouseInput.down ]: data =>
			{
				if ( last( this.lineState ) === State.done || !this.lineState[ 0 ] )
				{
					this.lines.push( [ this.mouseVector( data ) ] )

					this.lineState.push( State.drawing )
				}
			},
			[ MouseInput.move ]: data =>
			{
				if ( last( this.lineState ) === State.drawing )
				{
					last( this.lines )?.push( this.mouseVector( data ) )
				}
			},
			[ MouseInput.leave ]: () =>
			{
				if ( last( this.lineState ) === State.drawing )
				{
					this.lineState[ this.lineState.length - 1 ] = State.done
				}
			},
			[ MouseInput.up ]: () =>
			{
				if ( last( this.lineState ) === State.drawing )
				{
					this.lineState[ this.lineState.length - 1 ] = State.done
				}
			},
		}

		this.handleTouch = {
			[ TouchInput.start ]: data =>
			{
				if ( ( last( this.lineState ) === State.done || !this.lineState[ 0 ] ) && data.touches[ 0 ] )
				{
					this.lines.push( [ this.touchVector( data ) ] )

					this.lineState.push( State.drawing )
				}
			},
			[ TouchInput.move ]: data =>
			{
				if ( last( this.lineState ) === State.drawing && data.touches[ 0 ] )
				{
					last( this.lines )?.push( this.touchVector( data ) )
				}
			},
			[ TouchInput.cancel ]: () =>
			{
				if ( last( this.lineState ) === State.drawing )
				{
					this.lineState[ this.lineState.length - 1 ] = State.done
				}
			},
			[ TouchInput.end ]: () =>
			{
				if ( last( this.lineState ) === State.drawing )
				{
					this.lineState[ this.lineState.length - 1 ] = State.done
				}
			},
		}
	}
	
	/**
	 * Vector is derived from the mouse event position
	 * 
	 * @param event 
	 * @returns 
	 */
	private mouseVector( event: MouseEvent ): [number, number]
	{
		if ( !( event.currentTarget instanceof UICanvas ) ) return [ 0, 0 ]

		const canvas = event.currentTarget

		const rect = canvas.getBoundingClientRect()

		return [
			( event.clientX - rect.x ) / canvas.clientWidth,
			( event.clientY - rect.y ) / canvas.clientHeight
		]
	}
	
	/**
	 * Vector is derived from the first active touch event position
	 * 
	 * @param event 
	 * @returns 
	 */
	private touchVector( event: TouchEvent ): [number, number]
	{
		if ( !( event.currentTarget instanceof UICanvas ) ) return [ 0, 0 ]

		const canvas = event.currentTarget

		const rect = canvas.getBoundingClientRect()

		return [
			( event.touches[ 0 ].clientX - rect.x ) / canvas.clientWidth,
			( event.touches[ 0 ].clientY - rect.y ) / canvas.clientHeight
		]
	}

	/**
	 * Direct observed values to their respective handler methods
	 * @param value 
	 */
	@bind
	public next( value: UserInputEvent | UpdateLoop )
	{
		( `ctx` in value ) ? this.draw( value ) : this.input( value )
	}

	/**
	 * Handle user input, direct to handler functions for mouse and touch
	 * events seperately, as they require different logic.
	 * @param event 
	 */
	@bind
	private input( event: UserInputEvent )
	{
		( this.isMouseInputEvent( event ) )
			? this.handleMouse[ event.type ]( event.data )
			: this.handleTouch[ event.type ]( event.data )
	}

	/**
	 * Use the event type property to determine the kind of event data
	 * @param event 
	 * @returns 
	 */
	@bind
	private isMouseInputEvent( event: UserInputEvent ): event is MouseInputEvent
	{
		return this.mouseType.includes( event.type as MouseInput )
	}

	/**
	 * Perform all drawing functions here.
	 * 
	 * In this example, the array of lines are drawn by moving along a path
	 * of their segment components. The lines are drawn with stroke function
	 * which is set to use a gradient as the coloring style. The gradient
	 * appears to be animated as the canvas animation is iterated.
	 */
	@bind
	private draw( { ctx, delta }: UpdateLoop )
	{
		this.time += delta

		ctx.lineWidth = 4

		ctx.lineCap = `round`

		ctx.lineJoin = `round`

		let offset = 3333

		for ( const line of this.lines )
		{
			ctx.beginPath()
			
			ctx.moveTo( line[ 0 ][ 0 ] * ctx.canvas.width, line[ 0 ][ 1 ] * ctx.canvas.height )

			for ( const segment of line.slice( 1 ) )
			{
				ctx.lineTo( segment[ 0 ] * ctx.canvas.width, segment[ 1 ] * ctx.canvas.height )
			}

			ctx.strokeStyle = `hsl(${Math.abs( Math.cos( ( this.time + offset ) * ( 0.0000001 * ( offset % 10000 ) ) ) ) * 360}, 49%, 47%)`
		
			ctx.stroke()
	
			ctx.closePath()

			offset += 3333
		}
	}
}