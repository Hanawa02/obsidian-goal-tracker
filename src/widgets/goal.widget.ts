import { EditorView, WidgetType } from "@codemirror/view";
import { Menu } from "obsidian";

export interface Goal {
	done: number;
	target: number;
}

export class GoalWidget extends WidgetType {
	goal: Goal;

	constructor(goal: Goal) {
		super();
		this.goal = {
			target: goal.target || 1,
			done: goal.done || 0,
		};
	}

	toDOM(view: EditorView): HTMLElement {
		const container = document.createElement("span");
		const menu = new Menu();

		container.onClickEvent((event) => menu.showAtMouseEvent(event));

		container.classList.add("goal-container");

		const progress = ((this.goal.done / this.goal.target) * 100).toFixed(0);

		const content = `<span class="goal-progress-value">${progress}%</span> done:`;
		container.innerHTML = content;

		return container;
	}
}
