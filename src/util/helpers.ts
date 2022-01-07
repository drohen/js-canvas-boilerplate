
/**
 * Colors for use in components
 */
export const colors = {
	[ `space-cadet` ]: `hsl(238, 30%, 19%)`,
	[ `blue-sapphire` ]: `hsl(207, 34%, 31%)`,
}

/**
 * Get an element from a provided DOM/node tree
 * @param selector 
 * @param root 
 * @returns 
 */
export function el<T extends HTMLElement | SVGElement>( selector: string, root?: HTMLElement | Document | ShadowRoot | DocumentFragment ): T
{
	const el = ( root ?? document ).querySelector<T>( selector )

	if ( !el ) throw Error( `No element ${selector}` )

	return el
}

/**
 * "defined" filter for value to be passed to a function 
 * @param results 
 * @returns 
 */
export function using<T, V>( results: T | undefined | null )
{
	return {
		do: ( fn: ( results: T ) => V ) =>
		{
			if ( results !== undefined && results !== null )
				return fn( results )
		}
	}
}

/**
 * addEventListener alias
 * @param element 
 * @returns 
 */
export function listen<T extends ( HTMLElement | Document | SVGElement )>( element: T )
{
	return {
		on: <K extends keyof GlobalEventHandlersEventMap>( type: K ) =>
			( {
				do: ( listener: ( ( event: GlobalEventHandlersEventMap[K] ) => void ) ) =>
				{
					element.addEventListener(
						type as keyof GlobalEventHandlersEventMap,
						listener as ( event: GlobalEventHandlersEventMap[keyof GlobalEventHandlersEventMap] ) => void )

					return () => element.removeEventListener(
						type as keyof GlobalEventHandlersEventMap,
						listener as ( event: GlobalEventHandlersEventMap[keyof GlobalEventHandlersEventMap] ) => void  )
				}
			} )
	}
}

/**
 * Fetches the last value in an array
 * @param arr Array of any type
 * @returns Value of type or undefined (if empty array)
 */
export function last<T>( arr: T[] ): T | undefined
{
	return arr.length > 0 ? arr[ arr.length - 1 ] : undefined
}