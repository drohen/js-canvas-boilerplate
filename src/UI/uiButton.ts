import { UIComponent } from "./uiComponent"
import { define } from "web-component-decorator"
import { SubscriberHandler } from "../subscriberHandler"

@define( `ui-button` )
export class UIButton extends UIComponent implements ClickObservable
{
	public onClick: SubscriberHandler<void>

	constructor( mountFn: MountFn )
	{
		super( `ui-button`, mountFn )

		this.onClick = new SubscriberHandler()
	}

	protected onDefined(): void
	{
		/**
		 * A custom helper might be helpful to replace this 
		 * code in the case that its repeated over multiple
		 * custom elements.
		 */
		const button = this.shadowRoot?.querySelector( `button` )

		if ( !button ) throw Error( `No button` )

		button.addEventListener( `click`, () =>
		{
			this.onClick.next()
		} )
	}
}