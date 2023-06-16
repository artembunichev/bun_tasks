namespace $.$$ {

	export class $bun_tasks_task_item_controls extends $.$bun_tasks_task_item_controls {

		@ $mol_action
		change_date_plus( day_count: number ) {
			this.change_date( $bun_tasks_time_shift_days( this.date(), day_count ) )
		}

		@ $mol_action
		change_date_plus_one() {
			this.change_date_plus( 1 )
		}

		@ $mol_action
		change_date_plus_two() {
			this.change_date_plus( 2 )
		}

		@ $mol_action
		change_date_plus_three() {
			this.change_date_plus( 3 )
		}

	}

}
