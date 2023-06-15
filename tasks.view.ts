namespace $.$$ {

	export type $bun_tasks_date_type = 'undone' | 'done' | 'next'

	type Data_date_bar = Array< string >

	type Data_date = Record< string, Data_date_bar >

	type Data = Record<
		string,
		Data_date
	>

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

		@ $mol_mem
		data( next?: Data ): Data {
			if ( next !== undefined ) {
				Object.entries( next ).forEach( ( [ date, bars ] ) => {
					if ( Object.values( bars ).every( ids => ids.length === 0 ) ) {
						delete next[ date ]
					}
				} )
			}

			return $mol_state_local.value( 'data', next ) ?? {}
		}

		@ $mol_mem_key
		data_dates( date_id: string, next?: Data_date ) {
			if ( next !== undefined ) {
				this.data(
					{
						... this.data(),
						[ date_id ]: next,
					}
				)
			}

			return this.data()[ date_id ] ?? { '1': [], '2': [] }
		}

		@ $mol_mem_key
		task_ids_date_bar( { 0: date_id, 1: bar } : [ string, string ], next?: Data_date_bar ) {
			if ( next !== undefined ) {
				this.data_dates(
					date_id,
					{
						... this.data_dates( date_id ),
						[ bar ]: next,
					},
				)
			}
			return this.data_dates( date_id )[ bar ]
		}

		@ $mol_mem_key
		task_ids_date_current_bar( bar: string, next?: Data_date_bar ) {
			return this.task_ids_date_bar( [ this.date_selected_id(), bar ], next )
		}

		@ $mol_mem_key
		task_ids_date( date_id: string ) {
			return Object.values( this.data_dates( date_id ) ).reduce( ( acc, ids )=> {
				acc.push( ... ids )
				return acc
			}, [] )
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
		is_date_done( date_id: string ) {
			var is_prev_day = $bun_tasks_time_is_prev( date_id )

			if ( !is_prev_day ) {
				return false
			}

			var task_ids = this.task_ids_date( date_id )

			if ( !task_ids.length ) {
				return false
			}

			return task_ids.every( task_id => {
				var task = this.task( task_id )

				return task?.done() === true
			} )
		}

		@ $mol_mem_key
		is_date_undone( date_id: string ) {
			var is_prev_day = $bun_tasks_time_is_prev( date_id )

			if ( !is_prev_day ) {
				return false
			}

			var task_ids = this.task_ids_date( date_id )

			if ( !task_ids.length ) {
				return false
			}

			return task_ids.some( task_id => {
				var task = this.task( task_id )

				return task?.done() === false
			} )
		}

		@ $mol_mem_key
		is_date_next( date_id: string ) {
			var is_next_day = $bun_tasks_time_is_next( date_id )

			if ( !is_next_day ) {
				return false
			}

			var task_ids = this.task_ids_date( date_id )

			if ( !task_ids.length ) {
				return false
			}

			return task_ids.some( task_id => {
				var task = this.task( task_id )

				return task?.done() === false
			} )
		}

		@ $mol_mem_key
		date_type( date_id: string ): $bun_tasks_date_type | null {
			if ( this.is_date_done( date_id ) ) {
				return 'done'
			}

			else if ( this.is_date_undone( date_id ) ) {
				return 'undone'
			}

			else if ( this.is_date_next( date_id ) ) {
				return 'next'
			}

			return null
		}

	}

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

			obj.day_content = ( id: string )=> {
				var Day_button = obj.Day_button( id )
				Day_button.attr = ()=> ( {
					'current_date': $bun_tasks_time_is_today( id )
				} )

				return [
					Day_button,
					... this.date_type( id ) !== null ? [ this.Day_dot( id ) ] : [],
				]
			}
		}

		sub() {
			return [
				this.Task_calendar()
			]
		}

	}

}
