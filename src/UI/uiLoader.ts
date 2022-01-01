import bind from "bind-decorator"
import { SubscriberHandler } from "../subscriberHandler"
import { UIBlock } from "./uiBlock"
import { UIButton } from "./uiButton"

export type UIComponentType = UIBlock | UIButton

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
		const ctor = [ UIBlock, UIButton ]

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

		const button = new UIButton( this.loadComponent )

		main.appendChild( button )

		document.body.appendChild( main )

		/**
		 * Subscribe to click event to add more components
		 */
		button.onClick.subscribe( {
			next: () =>
			{
				const block = new UIBlock( this.loadComponent )

				main.appendChild( block )
			}
		} )
	}
}