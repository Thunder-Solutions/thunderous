import { css, customElement, html } from 'thunderous';
import { theme } from '../_styles/theme';

export const Link = customElement(({ attrSignals, adoptStyleSheet }) => {
	adoptStyleSheet(theme);
	adoptStyleSheet(linkStyles);
	const [href] = attrSignals.href;
	return html`<a href="${href}" part="a"><slot></slot></a>`;
});

const linkStyles = css`
	a {
		display: inline-block;
		color: var(--color-link-1);
		text-decoration: none;
	}
	a:hover {
		border-bottom: 1px solid;
	}
`;

export const InvisibleLink = customElement(({ attrSignals, adoptStyleSheet }) => {
	adoptStyleSheet(invisibleLinkStyles);
	const [href] = attrSignals.href;
	return html`<a href="${href}"><slot></slot></a>`;
});

const invisibleLinkStyles = css`
	:host {
		display: contents;
	}
	a,
	a:visited,
	a:hover,
	a:active {
		display: contents;
		color: inherit;
		text-decoration: none;
	}
`;
