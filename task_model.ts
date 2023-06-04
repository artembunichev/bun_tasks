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

		@ $mol_mem
		title( next?: string ) {
			return this.value( 'title', next )
		}

		@ $mol_mem
		details( next?: string ) {
			return this.value( 'details', next )
		}

		@ $mol_mem
		done( next?: boolean ) {
			return this.value( 'done', next )
		}

		@ $mol_mem
		data( data?: Task_data ): Task_data {
			return $mol_state_local.value( `task-${ this.id }`, data ) ?? { title: '', details: '', done: false }
		}

	}

}
