import { define } from "web-component-decorator"
import { colors, el, using } from "../util/helpers"
import { SubscriberHandler } from "../util/subscriberHandler"
import { UIComponent } from "./uiComponent"

@define( `ui-canvas` )
export class UICanvas extends UIComponent implements UpdateLoopObservable
{
	private previousTime: number

	public onUpdate: SubscriberHandler<UpdateLoop>

	constructor( mountFn: MountFn ) 
	{
		super( `ui-canvas`, mountFn )

		this.onUpdate = new SubscriberHandler()

		this.previousTime = 0
	}

	/**
	 * Once the canvas is mounted to the DOM, initialise
	 * to begin the canvas render loop
	 */
	public init(): void 
	{
		using( this.shadowRoot )
			.do( root =>
			{
				this.previousTime = performance.now()
		
				this.render( this.previousTime, this.getCtx( el( `canvas`, root ) ) )
			} )
	}

	/**
	 * Retrieve render context, throw exception if it doesn't exist
	 * @param canvas 
	 * @returns 
	 */
	private getCtx( canvas: HTMLCanvasElement )
	{
		const ctx = canvas.getContext( `2d` )

		if ( !ctx ) throw `No rendering context`

		return ctx
	}

	/**
	 * Render loop sets the correct dimensions to the canvas
	 * clears the canvas with the base canvas, and emits
	 * the time delta and render context.
	 * @param time 
	 * @param ctx 
	 */
	private render( time: number, ctx: CanvasRenderingContext2D )
	{
		const delta = time - this.previousTime

		const canvas = ctx.canvas

		this.setWH( canvas )

		ctx.fillStyle = colors[ `blue-sapphire` ]

		ctx.fillRect( 0, 0, canvas.width, canvas.height )

		this.onUpdate.next( { delta, ctx } )

		this.previousTime = time

		requestAnimationFrame( ( time ) => this.render( time, ctx ) )
	}

	/**
	 * Set the canvas size attributes for correct rendering
	 * @param canvas 
	 * @returns 
	 */
	private setWH( canvas: HTMLCanvasElement )
	{
		const { width, height } = canvas.getBoundingClientRect()

		if ( canvas.width === width && canvas.height === height ) return

		canvas.width = width

		canvas.height = height
	}
}