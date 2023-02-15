import { Binding } from "@src/bindings/binding";
import { Store } from "@src/bindings/stores/store";
import { BaseWindowControl } from "../baseWindowControl";
import { GenericBinder } from "./genericBinder";


/**
 * Binder for OpenRCT2 windows.
 */
export class WindowBinder extends GenericBinder<BaseWindowControl, Window | WindowDesc>
{
	/**
	 * Bind a window control to this binder.
	 */
	override _bind(control: BaseWindowControl): void
	{
		const window = control._description;
		if (window)
		{
			this._refresh(window);
		}
		this._source = control;
	}


	protected override _createBinding<T extends Window | WindowDesc, V>(_target: T, store: Store<V>, callback: (target: T, value: V) => void): Binding<T, V>
	{
		return new Binding<T, V>("", store, callback, (value: V): void =>
		{
			const control = this._source;
			// Only update if window is open.
			if (!control || !control._window)
				return;

			callback(<T>control._window, value);
		});
	}


	/**
	 * Updates the window with the values in registered bindings.
	 */
	private _refresh(window: Window | WindowDesc): void
	{
		const bindings = this._bindings;
		if (bindings)
		{
			for (const binding of bindings)
			{
				binding._callback(window, binding._store.get());
			}
		}
	}
}