import bind from "bind-decorator"

interface WithMount extends HTMLElement
{
	onMount: MountFn
}

/**
 * Helper class to build web components
 */
export class UIComponent extends HTMLElement
{
	private stylesheets: string[]

	private isDefined: boolean

	/**
	 * 
	 * @param tag tag indicates the unique 
	 * @param onMount requires onMount function to emit when a new element is instantiated.
	 */
	constructor( protected tag: string, public onMount?: MountFn ) 
	{
		super()

		this.getMount()

		this.isDefined = false

		this.stylesheets = []
		
		const template = this.getTemplate()

		const templateContent = template.content

		this.attachShadow( { mode: `open` } ).appendChild(
			templateContent.cloneNode( true )
		)

		this.registerStylesheet( `main.css` )

		customElements.whenDefined( this.tag ).then( () => 
		{
			this.isDefined = true

			this.onMount?.( this )

			for ( const stylesheet of this.stylesheets )
			{
				this.setStylesheet( stylesheet )
			}

			this.onDefined()
		} )
	}

	/**
	 * Iterate through the hierarchy of nodes until reaching
	 * the parent custom element that has been mounted to
	 * the DOM along with the mount observable, so it can
	 * emit itself, without needing to be directly instantiated
	 * and passed the function from the UI loader.
	 * 
	 * @param currentNode 
	 * @param level 
	 * @returns 
	 */
	private getMount( currentNode?: Node, level = 0 )
	{
		if ( this.onMount ) return

		const node = currentNode || this

		const nextNode = node instanceof ShadowRoot 
			? node.host
			: node.parentNode

		if ( this.hasMount( nextNode ) )
		{
			this.onMount = nextNode.onMount

			return
		}

		// 99 is arbitrary depth, it will likely exit before this
		if ( level === 99 || !nextNode ) throw Error( `No onMount` )
		else this.getMount( nextNode, level += 1 )
	}

	private hasMount( node: Node | null ): node is WithMount
	{
		return node ? `onMount` in node : false
	}

	/**
	 * Get the template object from the DOM to be used
	 * for this instance.
	 *  
	 * @returns HTMLTemplateElement object
	 */
	private getTemplate(): HTMLTemplateElement
	{
		const el = document.getElementById( this.tag )

		if ( !el ) throw Error( `No element ${this.tag}` )

		if ( !( el instanceof HTMLTemplateElement ) )
			throw Error( `Element is not a template` )

		return el
	}
	
	@bind
	private setStylesheet( path: string )
	{
		const linkElem = document.createElement( `link` )

		linkElem.setAttribute( `rel`, `stylesheet` )

		linkElem.setAttribute( `href`, path )

		this.shadowRoot?.appendChild( linkElem )
	}

	/**
	 * 
	 * @param path URL path for the base stylesheet, or another to be used by this element
	 */
	@bind
	protected registerStylesheet( path: string )
	{
		if ( !this.isDefined ) this.stylesheets.push( path )
		else this.setStylesheet( path )
	}

	protected onDefined()
	{
		// set in inheriting class
	}
}