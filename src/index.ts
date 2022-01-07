import bind from "bind-decorator"
import { Render } from "./render"
import { InputSystem } from "./system/inputSystem"
import { UICanvas } from "./UI/uiCanvas"
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

	private input: InputSystem

	private render: Render

	constructor()
	{
		this.components = []

		this.render = new Render()
		
		this.input = new InputSystem()

		this.input.onInput.subscribe( this.render )

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
	}

	@bind
	public next( component: UIComponent )
	{
		this.components.push( component )

		if ( component instanceof UICanvas )
		{
			component.init()

			this.input.next( component )

			component.onUpdate.subscribe( this.render )
		}
	}
}

Main.run()