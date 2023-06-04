namespace $ {

	export class $bun_tasks_task_model extends $mol_object {

		@ $mol_mem
		id( next?: string ) {
			return next ?? '0-0'
		}

		@ $mol_mem
		title( next?: string ) {
			return $mol_state_local.value( `task-${ this.id() }-title`, next ) ?? ''
		}

		@ $mol_mem
		details( next?: string ) {
			return $mol_state_local.value( `task-${ this.id() }-details`, next ) ?? ''
		}

		@ $mol_mem
		done( next?: boolean ) {
			return $mol_state_local.value( `task-${ this.id() }-done`, next ) ?? false
		}

	}

}
