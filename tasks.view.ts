namespace $.$$ {

	export class $bun_tasks extends $.$bun_tasks {

		@ $mol_mem
		date_selected( next?: $mol_time_moment ): $mol_time_moment {
			return next ?? new $mol_time_moment()
		}

		@ $mol_mem
		date_selected_id() {
			var { year, month, day } = this.date_selected()
			return `${ year }-${ month }-${ day }`
		}

	}

	export class $bun_tasks_bar extends $.$bun_tasks_bar {

		date_id() {
			return ``
		}

		@ $mol_mem
		ord_id( next?: number ) {
			return next ?? 0
		}

		@ $mol_mem
		id() {
			return `${ this.date_id() }-${ this.ord_id() }`
		}

		@ $mol_mem
		ids( next?: Array< string > ){
			return $mol_state_local.value( `task-ids-${ this.id() }`, next ) ?? []
		}

		@ $mol_mem
		ord_ids() {
			return this.ids().map( id => Number( id.split( '-' ).at( -1 ) ) )
		}

		new_id() {
			return `${ this.id() }-${ Math.max( 0, ...this.ord_ids() ) + 1 }`
		}

		@ $mol_mem_key
		task( id: string, next?: $bun_tasks_task_model | null ) {
			var key = `task-${ id }`

			if ( next === undefined ) {
				var model_data = $mol_state_local.value( key, next )

				if ( model_data ) {
					var model = new $bun_tasks_task_model( id )
					model.data( model_data )
					return model
				}

				return null
			}

			if ( next === null ) {
				return $mol_state_local.value( key, null )
			}

			return next
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

			const new_id = this.new_id()
			var new_task = new $bun_tasks_task_model( new_id )
			new_task.title( this.input_title_value() )
			new_task.details( this.input_details_value() )

			this.task( new_id, new_task )

			this.ids( [ ...this.ids(), new_id ] )

			this.input_title_value( '' )
			this.input_details_value( '' )
		}

		toggle_task_done( id: string ) {
			this.task_done( id, !this.task_done( id ) )
		}

		drop_task( id: string ) {
			this.task( id, null )
			this.ids( this.ids().filter( id2 => id2 !== id ) )
		}

		tasks_sorted() {
			return this.ids().sort( ( a, b )=> {
				return Number( this.task_done( a ) ) - Number( this.task_done( b ) )
			} )
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
