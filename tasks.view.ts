namespace $.$$ {

	export type $bun_tasks_date_type = 'undone' | 'done' | 'next'

	export class $bun_tasks extends $.$bun_tasks {

		@ $mol_mem
		date_selected( next?: $mol_time_moment ): $mol_time_moment {
			return next ?? new $mol_time_moment()
		}

		@ $mol_mem
		date_selected_id() {
			var date = this.date_selected()

			var date_id = date.toString( "YYYY-MM-DD" )

			return date_id
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

		task_bar_id( date: string, ord_id: number ) {
			return `${ date }-${ ord_id }`
		}

		@ $mol_mem_key
		current_task_bar_id( ord_id: number ) {
			return this.task_bar_id( this.date_selected_id(), ord_id )
		}

		@ $mol_mem_key
		task_bar_task_ids( id: string, next?: Array< string > ) {
			return $mol_state_local.value( `task-ids-${ id }`, next ) ?? []
		}

		@ $mol_mem_key
		current_task_bar_task_ids( ord_id: number, next?: Array< string > ) {
			return this.task_bar_task_ids( this.current_task_bar_id( ord_id ), next )
		}

		@ $mol_mem_key
		date_all_task_ids( id: string ) {
			return [
				...this.task_bar_task_ids( this.task_bar_id( id, 1 ) ),
				...this.task_bar_task_ids( this.task_bar_id( id, 2 ) )
			]
		}

		@ $mol_mem_key
		is_date_done( id: string ) {
			var is_prev_day = $bun_tasks_time_is_prev( id )

			if ( !is_prev_day ) {
				return false
			}

			var task_ids = this.date_all_task_ids( id )

			if ( !task_ids.length ) {
				return false
			}

			return task_ids.every( task_id => {
				var task = this.task( task_id )

				return task?.done() === true
			} )
		}

		@ $mol_mem_key
		is_date_undone( id: string ) {
			var is_prev_day = $bun_tasks_time_is_prev( id )

			if ( !is_prev_day ) {
				return false
			}

			var task_ids = this.date_all_task_ids( id )

			if ( !task_ids.length ) {
				return false
			}

			return task_ids.some( task_id => {
				var task = this.task( task_id )

				return task?.done() === false
			} )
		}

		@ $mol_mem_key
		is_date_next( id: string ) {
			var is_next_day = $bun_tasks_time_is_next( id )

			if ( !is_next_day ) {
				return false
			}

			var task_ids = this.date_all_task_ids( id )

			if ( !task_ids.length ) {
				return false
			}

			return task_ids.some( task_id => {
				var task = this.task( task_id )

				return task?.done() === false
			} )
		}

		@ $mol_mem_key
		date_type( id: string ): $bun_tasks_date_type | null {
			if ( this.is_date_done( id ) ) {
				return 'done'
			}

			else if ( this.is_date_undone( id ) ) {
				return 'undone'
			}

			else if ( this.is_date_next( id ) ) {
				return 'next'
			}

			return null
		}

	}

	export class $bun_tasks_bar extends $.$bun_tasks_bar {

		@ $mol_mem
		id( next?: string ) {
			return next ?? '0-0'
		}

		@ $mol_mem
		ord_ids() {
			return this.ids().map( id => Number( id.split( '-' ).at( -1 ) ) )
		}

		new_id() {
			return `${ this.id() }-${ Math.max( 0, ...this.ord_ids() ) + 1 }`
		}

		sort_task_ids() {
			this.ids(
				this.ids().slice().sort( ( a, b )=> {
					return Number( this.task_done( a ) ) - Number( this.task_done( b ) )
				} )
			)
		}

		@ $mol_mem_key
		task_index( id: string ) {
			return this.ids().findIndex( id2 => id === id2 )
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
			this.ids( this.ids().filter( id2 => id2 !== id ) )
		}

		move_task_up( id: string ) {
			this.ids( $bun_array_move_up( this.ids(), this.task_index( id ) ) )
		}

		move_task_down( id: string ) {
			this.ids( $bun_array_move_down( this.ids() , this.task_index( id ) ) )
		}

		move_task_top( id: string ) {
			this.ids( $bun_array_move_top( this.ids(), this.task_index( id ) ) )
		}

		move_task_bottom( id: string ) {
			var { before: undone_ids, after: done_ids } = $bun_array_divide( this.ids(), ( id )=> this.task_done( id ) )

			var new_undone_ids = $bun_array_move_bottom( undone_ids, this.task_index( id ) )

			this.ids( [ ...new_undone_ids, ...done_ids ] )
		}

		tasks() {
			return this.ids().map( id => this.Task( id ) )
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

	export class $bun_tasks_calendar extends $.$bun_tasks_calendar {

		@ $mol_mem_key
		Day_dot( id: string ) {
			var obj = new this.$.$mol_view()

			obj.attr = ()=> ( {
				'dot_type': this.date_type( id )
			} )

			return obj
		}

		Task_calendar() {
			var obj  = this.Calendar()

			obj.day_content = ( id: string )=> [
				obj.Day_button( id ),
				... this.date_type( id ) !== null ? [ this.Day_dot( id ) ] : []
			]
		}

		sub() {
			return [
				this.Task_calendar()
			]
		}

	}

}
