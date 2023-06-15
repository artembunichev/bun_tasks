namespace $ {

	export type $bun_tasks_task_data = {
		title: string
		details: string
		done: boolean
	}

	export class $bun_tasks_task_model extends $mol_store< $bun_tasks_task_data > {

		constructor( readonly id: string ) {
			super()
		}

		data_default: $bun_tasks_task_data = { title: '', details: '', done: false }

		@ $mol_mem
		data( data?: $bun_tasks_task_data ) {
			if ( data ) {
				var tasks = $mol_state_local.value( 'tasks' ) as $bun_tasks_tasks_data

				var new_tasks = {
					... tasks,
					[ this.id ]: data
				}

				$mol_state_local.value( 'tasks', new_tasks )
			}

			return data ?? this.data_default
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
