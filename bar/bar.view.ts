namespace $.$$ {

	export class $bun_tasks_bar extends $.$bun_tasks_bar {

		new_task_id() {
			return $mol_guid( 6 )
		}

		sort_task_ids() {
			this.task_ids(
				this.task_ids().slice().sort( ( a, b )=> {
					return Number( this.task_done( a ) ) - Number( this.task_done( b ) )
				} )
			)
		}

		@ $mol_mem_key
		task_index( id: string ) {
			return this.task_ids().findIndex( id2 => id === id2 )
		}

		@ $mol_mem_key
		task_title( id: string, next?: string ) {
			return this.task( id )?.title( next ) ?? ''
		}

		@ $mol_mem_key
		task_details( id: string, next?: string ) {
			return this.task( id )?.details( next ) ?? ''
		}

		@ $mol_mem_key
		task_done( id: string, next?: boolean ) {
			return this.task( id )?.done( next ) ?? false
		}

		add_task() {
			if ( !this.input_title_value() && !this.input_details_value() ) {
				return
			}

			const new_task_id = this.new_task_id()
			var new_task = new $bun_tasks_task_model( new_task_id )
			new_task.title( this.input_title_value() )
			new_task.details( this.input_details_value() )

			this.task( new_task_id, new_task )

			this.task_ids( [ ... this.task_ids(), new_task_id ] )

			this.sort_task_ids()

			this.input_title_value( '' )
			this.input_details_value( '' )
		}

		toggle_task_done( id: string ) {
			this.task_done( id, !this.task_done( id ) )
			this.sort_task_ids()
		}

		drop_task( id: string ) {
			this.task( id, null )
			this.task_ids( this.task_ids().filter( id2 => id2 !== id ) )
		}

		move_task_up( id: string ) {
			this.task_ids( $bun_array_move_up( this.task_ids(), this.task_index( id ) ) )
		}

		move_task_down( id: string ) {
			this.task_ids( $bun_array_move_down( this.task_ids(), this.task_index( id ) ) )
		}

		move_task_top( id: string ) {
			this.task_ids( $bun_array_move_top( this.task_ids(), this.task_index( id ) ) )
		}

		move_task_bottom( id: string ) {
			var { before: undone_ids, after: done_ids } = $bun_array_divide( this.task_ids(), ( id )=> this.task_done( id ) )

			var new_undone_ids = $bun_array_move_bottom( undone_ids, this.task_index( id ) )

			this.task_ids( [ ...new_undone_ids, ...done_ids ] )
		}

		@ $mol_mem
		tasks() {
			return this.task_ids().map( id => this.Task( id ) )
		}

	}


}
