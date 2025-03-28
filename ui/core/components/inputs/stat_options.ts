import { GLOBAL_DISPLAY_STATS } from '../../constants/other';
import { IndividualSimUI } from '../../individual_sim_ui';
import { Player } from '../../player';
import { Spec, Stat } from '../../proto/common';
import { ActionId } from '../../proto_utils/action_id';
import { IconEnumPicker, IconEnumPickerConfig } from '../icon_enum_picker';
import { IconPicker, IconPickerConfig } from '../icon_picker';
import { MultiIconPicker, MultiIconPickerConfig } from '../multi_icon_picker';

export interface ActionInputConfig<T> {
	actionId: (player: Player<Spec>) => ActionId | null;
	value: T;
	minLevel?: number;
	maxLevel?: number;
	showWhen?: (player: Player<Spec>) => boolean;
}

export interface StatOption {
	stats: Array<Stat>;
}

export interface ItemStatOption<T> extends StatOption {
	config: ActionInputConfig<T>;
}

export interface PickerStatOption<PickerType, ConfigType> extends StatOption {
	config: ConfigType;
	picker: PickerType;
}

export interface IconPickerStatOption extends PickerStatOption<typeof IconPicker<Player<any>, any>, IconPickerConfig<Player<any>, any>> {}

export interface MultiIconPickerStatOption extends PickerStatOption<typeof MultiIconPicker<Player<any>>, MultiIconPickerConfig<Player<any>>> {}

export interface IconEnumPickerStatOption extends PickerStatOption<typeof IconEnumPicker<Player<any>, any>, IconEnumPickerConfig<Player<any>, any>> {}

export type ItemStatOptions<T> = ItemStatOption<T>;
export type PickerStatOptions = IconPickerStatOption | MultiIconPickerStatOption | IconEnumPickerStatOption;
export type StatOptions<T, Options extends ItemStatOptions<T> | PickerStatOptions> = Array<Options>;

export function relevantStatOptions<T, OptionsType extends ItemStatOptions<T> | PickerStatOptions>(
	options: StatOptions<T, OptionsType>,
	simUI: IndividualSimUI<Spec>,
): StatOptions<T, OptionsType> {
	return options.filter(
		option =>
			// Filter out excluded options
			!simUI.individualConfig.excludeBuffDebuffInputs.includes(option.config) &&
			// Compare stats
			(option.stats.length == 0 ||
				option.stats.some(stat => simUI.individualConfig.displayStats.includes(stat) || GLOBAL_DISPLAY_STATS.includes(stat)) ||
				// Check included options
				simUI.individualConfig.includeBuffDebuffInputs.includes(option.config)),
	);
}
