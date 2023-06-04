namespace $.$$ {

	export class $bun_tasks_bar extends $.$bun_tasks_bar {

		@ $mol_mem
		id( next?: number ) {
			return next ?? 0
		}

		@ $mol_mem
		ids( next?: Array< string > ){
			return $mol_state_local.value( `task-ids-${ this.id() }`, next ) ?? []
		}

		@ $mol_mem
		ordinal_ids() {
			return this.ids().map( id => Number( id.split( '-' ).at( -1 ) ) )
		}

		new_id() {
			return `${ this.id() }-${ Math.max( 0, ...this.ordinal_ids() ) + 1 }`
		}


		@ $mol_mem_key
		task( id: string, next?: $bun_tasks_task_model ) {
			return next ?? null
		}

		@ $mol_mem_key
		task_title( id: string, next?: string ) {
			return $mol_state_local.value( `task-${ id }-title`, next ) ?? this.task( id )?.title( next ) ?? ''
		}

		@ $mol_mem_key
		task_details( id: string, next?: string ) {
			return $mol_state_local.value( `task-${ id }-details`, next ) ?? this.task( id )?.details( next ) ?? ''
		}

		@ $mol_mem_key
		task_done( id: string, next?: boolean ) {
			return $mol_state_local.value( `task-${ id }-done`, next ) ?? this.task( id )?.done( next ) ?? false
		}

		add_task() {
			if ( !this.input_title_value() && !this.input_details_value() ) {
				return
			}

			const new_id = this.new_id()
			var new_task = new $bun_tasks_task_model()
			new_task.id( new_id )
			new_task.title( this.input_title_value() )
			new_task.details( this.input_details_value() )

			this.task( new_id, new_task )

			this.ids( [ ...this.ids(), new_id ] )

			this.input_title_value( '' )
			this.input_details_value( '' )
		}

		tasks_sorted() {
			return this.ids().sort( ( a, b )=> {
				return Number( this.task_done( a ) ) - Number( this.task_done( b ) )
			} )
		}

		toggle_task_done( id: string ) {
			this.task_done( id, !this.task_done( id ) )
		}

		tasks() {
			return this.tasks_sorted().map( id => this.Task( id ) )
		}

	}


	export class $bun_tasks_task_item extends $.$bun_tasks_task_item {

		@ $mol_mem
		edit_mode( next?: boolean ) {
			return next ?? false
		}

		toggle_edit_mode() {
			this.edit_mode( !this.edit_mode() )
		}

		quit_edit_mode() {
			this.edit_mode( false )
		}

	}

	export class $bun_tasks_editable_text extends $.$bun_tasks_editable_text {

		@ $mol_mem
		edit_mode( next?: boolean ) {
			return next ?? false
		}

		sub() {
			return [
				this.edit_mode() ? this.Edit() : this.Non_edit()
			]
		}

	}

}
