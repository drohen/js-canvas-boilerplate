import bind from "bind-decorator"
import { SubscriberHandler } from "../util/subscriberHandler"
import { UICanvas } from "./uiCanvas"

export type UIComponentType = UICanvas

export class UILoader extends SubscriberHandler<UIComponentType>
{
	constructor()
	{
		super()
	}

	@bind
	private loadComponent<T extends HTMLElement>( instance: T )
	{
		// Only emit valid UI components 
		this.isUIComponent( instance ) && this.next( instance )
	}

	/**
	 * Return on first encounter of a matching UIComponent type, or fail
	 * 
	 * @param component 
	 * @returns 
	 */
	public isUIComponent( component: HTMLElement ): component is UIComponentType
	{
		const ctor = [ UICanvas ]

		const list = ctor.find( c => component instanceof c )

		return !!list
	}

	/**
	 * Imports load the web components
	 * This function then initialises the first view
	 */
	public load()
	{
		const main = document.createElement( `main` )

		const canvas = new UICanvas( this.loadComponent )

		main.appendChild( canvas )

		document.body.appendChild( main )
	}
}