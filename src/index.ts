import bind from "bind-decorator"
import { UIBlock } from "./UI/uiBlock"
import type { UIComponent } from "./UI/uiComponent"
import { UILoader } from "./UI/uiLoader"

/**
 * Entrypoint for the app.
 */
class Main implements Observer<UIComponent>
{
	/** 
	 * Static method `run()` helps instantiate the class
	 * when the script is loaded by the browser.
	 */
	public static run()
	{
		new Main()
	}

	private components: UIComponent[]

	private uiLoader: UILoader

	constructor()
	{
		this.components = []

		/**
		 * The mount system is used by the UI components to let
		 * our main class know when it has been registered into
		 * the web component registry. This makes it possible
		 * to observe these instances, and trigger various
		 * public methods.
		 */
		this.uiLoader = new UILoader()

		this.uiLoader.subscribe( this )

		// Build and mount the UI to the DOM
		this.uiLoader.load()

		this.update( performance.now() )
	}

	// Example loop
	@bind
	private update( time: number )
	{
		for ( const component of this.components )
		{
			if ( component instanceof UIBlock )
			{
				component.next( String( ~~( time * 100000 ) ) )
			}
		}

		requestAnimationFrame( this.update )
	}

	@bind
	public next( component: UIComponent )
	{
		this.components.push( component )
	}
}

Main.run()