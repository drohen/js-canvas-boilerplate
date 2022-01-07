/**
 * - take mount or tap input
 * - create lines in line entity
 * - render through canvas render loop
 */

import { listen } from "../util/helpers"
import type { UICanvas } from "../UI/uiCanvas"
import { SubscriberHandler } from "../util/subscriberHandler"
import bind from "bind-decorator"

export enum MouseInput
{
	down = `mousedown`,
	move = `mousemove`,
	leave = `mouseleave`,
	up = `mouseup`
}

export enum TouchInput
{
	start =`touchstart`,
	move = `touchmove`,
	cancel = `touchcancel`,
	end = `touchend`
}

export interface MouseInputEvent extends GenericInputEvent<MouseEvent>
{
	type: MouseInput
}

export interface TouchInputEvent extends GenericInputEvent<TouchEvent>
{
	type: TouchInput
}

/**
 * Differentiate user input types and their data
 */
export type UserInputEvent = MouseInputEvent | TouchInputEvent

export class InputSystem implements Observer<UICanvas>, InputObservable
{
	public onInput: SubscriberHandler<UserInputEvent>

	constructor()
	{
		this.onInput = new SubscriberHandler()
	}

	/**
	 * Attach input event listeners to the UICanvas element
	 * Construct an event type object, then emit observable data
	 * @param canvas 
	 */
	@bind
	private handleMountInput( canvas: UICanvas )
	{
		const ev = listen( canvas )

		/**
		 * "Intent to act" - create active sequence
		 */

		ev.on( MouseInput.down ).do( ( event ) =>
		{
			event.preventDefault()

			this.onInput.next( { type: MouseInput.down, data: event } )
		} )

		ev.on( TouchInput.start ).do( ( event ) =>
		{
			event.preventDefault()

			this.onInput.next( { type: TouchInput.start, data: event } )
		} )

		/**
		 * "User action" - repeats in sequence
		 */

		ev.on( MouseInput.move ).do( ( event ) =>
		{
			event.preventDefault()

			this.onInput.next( { type: MouseInput.move, data: event } )
		} )

		ev.on( TouchInput.move ).do( ( event ) =>
		{
			event.preventDefault()

			this.onInput.next( { type: TouchInput.move, data: event } )
		} )

		/**
		 * "End action" - ends action sequence
		 */

		ev.on( MouseInput.leave ).do( ( event ) =>
		{
			event.preventDefault()

			this.onInput.next( { type: MouseInput.leave, data: event } )
		} )

		ev.on( MouseInput.up ).do( ( event ) =>
		{
			event.preventDefault()

			this.onInput.next( { type: MouseInput.up, data: event } )
		} )

		ev.on( TouchInput.cancel ).do( ( event ) =>
		{
			event.preventDefault()

			this.onInput.next( { type: TouchInput.cancel, data: event } )
		} )

		ev.on( TouchInput.end ).do( ( event ) =>
		{
			event.preventDefault()

			this.onInput.next( { type: TouchInput.end, data: event } )
		} )
	}

	/**
	 * Receive observed UICanvas to add a input event listeners
	 * @param component 
	 */
	@bind
	public next( component: UICanvas )
	{
		this.handleMountInput( component )
	}
}