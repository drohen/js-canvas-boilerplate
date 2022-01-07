export class SubscriberHandler<T>
{
	private subscriber?: Observer<T>

	public next( data: T )
	{
		this.subscriber?.next?.( data )
	}

	public complete()
	{
		this.subscriber?.complete?.()
	}

	public error( error: Error )
	{
		this.subscriber?.error?.( error )
	}

	public subscribe( observer: Observer<T> )
	{
		this.subscriber = observer
	}
}