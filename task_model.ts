namespace $ {

	export class $bun_tasks_task_model {

		@ $mol_mem
		id( next?: number ) {
			return next ?? 0 
		}

		@ $mol_mem
		title( next?: string ) {
			return next ?? ''
		}

		@ $mol_mem
		details( next?: string ) {
			return next ?? ''
		}

		@ $mol_mem
		done( next?: boolean ) {
			return next ?? false
		}

	}

}
