namespace $ {

	export class $bun_tasks_task_model extends $mol_object {

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
