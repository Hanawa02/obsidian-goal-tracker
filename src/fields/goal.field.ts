import {
	Extension,
	RangeSetBuilder,
	StateField,
	Transaction,
} from "@codemirror/state";
import { Decoration, DecorationSet, EditorView } from "@codemirror/view";
import { Goal, GoalWidget } from "./../widgets/goal.widget";

const GOAL_KEY_INDENTIFIER = "goal:";
const TARGET_SEPARATOR = "/";
const DESCRIPTION_SEPARATOR = "-";
const UNIT_START_SEPARATOR = "(";
const UNIT_END_SEPARATOR = ")";

function getGoalFromText(text: string, goalIndex: number): Goal | null {
	const targetSeparatorIndex = text.indexOf(TARGET_SEPARATOR, goalIndex);
	const descriptionSeparatorIndex = text.indexOf(
		DESCRIPTION_SEPARATOR,
		goalIndex
	);

	if (targetSeparatorIndex < 0) {
		return null;
	}

	const done = parseInt(
		text
			.substring(
				goalIndex + GOAL_KEY_INDENTIFIER.length,
				targetSeparatorIndex
			)
			.trim()
	);

	const unitStartSeparatorIndex = text.indexOf(
		UNIT_START_SEPARATOR,
		goalIndex
	);
	const unitEndSeparatorIndex = text.indexOf(
		UNIT_END_SEPARATOR,
		unitStartSeparatorIndex
	);

	const unitEndIndex = unitEndSeparatorIndex
		? unitEndSeparatorIndex + 1
		: descriptionSeparatorIndex;

	const hasUnit = unitStartSeparatorIndex > 0;
	const unit = hasUnit
		? text.substring(unitStartSeparatorIndex, unitEndIndex)
		: "";

	const target = parseInt(
		text
			.replace(unit, "")
			.substring(targetSeparatorIndex + 1, descriptionSeparatorIndex)
			.trim()
	);

	const goal: Goal = {
		done,
		target,
	};

	return goal;
}

export const goalField = StateField.define<DecorationSet>({
	create(): DecorationSet {
		return Decoration.none;
	},
	update(_: DecorationSet, transaction: Transaction): DecorationSet {
		const builder = new RangeSetBuilder<Decoration>();

		const doc = transaction?.state?.doc;

		for (let lineNumber = 1; lineNumber <= doc.lines; lineNumber++) {
			const line = doc.line(lineNumber);
			const text = line.text;

			const goalIndex = text.indexOf(GOAL_KEY_INDENTIFIER);
			if (goalIndex >= 0) {
				const goal = getGoalFromText(text, goalIndex);

				if (!goal) {
					continue;
				}
				const from = line.from + goalIndex;

				builder.add(
					from,
					from + GOAL_KEY_INDENTIFIER.length,
					Decoration.replace({
						widget: new GoalWidget(goal),
					})
				);
			}
		}

		return builder.finish();
	},
	provide(field: StateField<DecorationSet>): Extension {
		return EditorView.decorations.from(field);
	},
});
