import { Plugin } from "obsidian";
import { goalField } from "../fields/goal.field";

export default class GoalTracker extends Plugin {
	async onload() {
		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		const date = new Date();
		const minutes = date.getMinutes();
		statusBarItemEl.setText(
			`Last updated at: ${date.getHours()}:${
				minutes > 9 ? minutes : "0" + minutes
			}`
		);

		this.registerEditorExtension([goalField]);
	}

	onunload() {}
}
