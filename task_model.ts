namespace $ {

	type Task_data = {
		title: string
		details: string
		done: boolean
	}

	export class $bun_tasks_task_model extends $mol_store< Task_data > {

		constructor( readonly id: string ) {
			super()
		}

		data_default: Task_data = { title: '', details: '', done: false }

		@ $mol_mem
		data( data?: Task_data ) {
			return $mol_state_local.value( `task-${ this.id }`, data ) ?? this.data_default
		}

		title( next?: string ) {
			return this.value( 'title', next )
		}

		details( next?: string ) {
			return this.value( 'details', next )
		}

		done( next?: boolean ) {
			return this.value( 'done', next )
		}

	}

}
