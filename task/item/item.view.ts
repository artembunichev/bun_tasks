namespace $.$$ {

	export class $bun_tasks_task_item extends $.$bun_tasks_task_item {

		@ $mol_mem
		edit_mode( next?: boolean ) {
			return next ?? false
		}

		@ $mol_action
		toggle_edit_mode() {
			this.edit_mode( !this.edit_mode() )
		}

		@ $mol_action
		quit_edit_mode() {
			this.edit_mode( false )
		}

	}

}
