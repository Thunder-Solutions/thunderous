// import '@webcomponents/scoped-custom-element-registry';
import { derived, css, html, customElement, createRegistry, onServerDefine } from 'thunderous';

onServerDefine((tagName, htmlString) => {
	console.log(`Server defined: ${tagName}`);
	console.log(htmlString);
});

const globalRegistry = createRegistry();

const registry = createRegistry({ scoped: true });
customElement(
	({ attrSignals }) => {
		const [text] = attrSignals.text;
		return html`<strong>${text}</strong>`;
	},
	{
		shadowRootOptions: { mode: 'open' },
	},
)
	.register(registry)
	.define('nested-element');

const MyElement = customElement<{ count: number }>(
	({ attrSignals, propSignals, customCallback, internals, clientOnlyCallback, adoptStyleSheet }) => {
		const [count, setCount] = propSignals.count;
		setCount(0);
		const [heading] = attrSignals.heading;

		const redValue = derived(() => {
			const value = count() * 10;
			return value > 255 ? 255 : value;
		});

		clientOnlyCallback(() => {
			internals.setFormValue(String(count()));
		});

		const increment = customCallback(() => {
			setCount(count() + 1);
			internals.setFormValue(String(count()));
		});

		adoptStyleSheet(css`
			:host {
				display: grid;
				gap: 0.5rem;
				padding: 1rem;
				margin: 1rem 0;
				background-color: rgb(${redValue}, 0, 0);
				color: white;
				font-size: 2rem;
				font-family: sans-serif;
			}
			h1 {
				margin: 0;
			}
			button {
				font: inherit;
				padding: 0.5rem;
			}
		`);

		return html`
			<div><h1>${heading}</h1></div>
			<button onclick="${increment}">increment</button>
			<output>count: ${count}</output>
			<div>
				<slot></slot>
			</div>
			<span>this is a scoped element:</span>
			<nested-element text="test"></nested-element>
		`;
	},
	{
		formAssociated: true,
		observedAttributes: ['heading'],
		attributesAsProperties: [['count', Number]],
		shadowRootOptions: { registry },
	},
).register(globalRegistry);

// requestAnimationFrame(() => {
// 	const tagName = globalRegistry.getTagName(MyElement);
// 	console.log(tagName);
// });

MyElement.define('my-element');

// const myElement = document.querySelector('my-element')!;

// document.querySelector('button')!.addEventListener('click', () => {
// 	const prev = myElement.getAttribute('heading');
// 	myElement.setAttribute('heading', prev === 'title A' ? 'title B' : 'title A');
// });
