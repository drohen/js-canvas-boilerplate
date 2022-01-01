import { UIComponent } from "./uiComponent"
import { define } from "web-component-decorator"

@define( `ui-block` )
export class UIBlock extends UIComponent implements Observer<string>
{
	constructor( mountFn: MountFn )
	{
		super( `ui-block`, mountFn )
	}

	next( value: string )
	{
		this.textContent = value
	}
}