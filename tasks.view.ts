namespace $ {
	export type $bun_tasks_tasks_data = Record< string, $bun_tasks_task_data >
}

namespace $.$$ {

	export type $bun_tasks_date_type = 'undone' | 'done' | 'next'

	type Bar_task_ids = Array< string >

	type Date_bars = Record< string, Bar_task_ids >

	type Date_list = Record<
		string,
		Date_bars
	>

	export class $bun_tasks extends $.$bun_tasks {

		@ $mol_mem
		tasks_data( next?: $bun_type_nullable< $bun_tasks_tasks_data > ) {
			if ( next !== undefined ) {
				Object.entries( next ).forEach( ( [ id, task ] )=> {
					if ( task === null ) {
						delete next[ id ]
					}
				} )
			}

			return $mol_state_local.value( 'tasks', next as $bun_tasks_tasks_data ) ?? {}
		}

		@ $mol_mem_key
		task( id: string, next?: $bun_tasks_task_model | null ) {
			if ( next === undefined ) {
				var model_data = this.tasks_data()[ id ]

				if ( model_data ) {
					var model = new $bun_tasks_task_model( id )
					model.data( model_data )
					return model
				}

				return null
			}

			this.tasks_data( {
				... this.tasks_data(),
				[ id ]: next?.data() ?? null,
			} )

			return next
		}

		@ $mol_mem
		date_list( next?: Date_list ) {
			if ( next !== undefined ) {
				Object.entries( next ).forEach( ( [ date, bars ] ) => {
					if ( Object.values( bars ).every( ids => ids.length === 0 ) ) {
						delete next[ date ]
					}
				} )
			}

			return $mol_state_local.value( 'date_list', next ) ?? {}
		}

		@ $mol_mem_key
		date_bars( date_id: string, next?: Date_bars ) {
			if ( next !== undefined ) {
				this.date_list(
					{
						... this.date_list(),
						[ date_id ]: next,
					}
				)
			}

			return this.date_list()[ date_id ] ?? { '1': [], '2': [] }
		}

		@ $mol_mem_key
		bar_task_ids( { 0: date_id, 1: bar } : [ string, string ], next?: Bar_task_ids ) {
			if ( next !== undefined ) {
				this.date_bars(
					date_id,
					{
						... this.date_bars( date_id ),
						[ bar ]: next,
					},
				)
			}
			return this.date_bars( date_id )[ bar ]
		}

		@ $mol_mem_key
		bar_task_ids_current_date( bar: string, next?: Bar_task_ids ) {
			return this.bar_task_ids( [ this.date_selected_id(), bar ], next )
		}

		@ $mol_mem_key
		task_ids_date( date_id: string ) {
			return Object.values( this.date_bars( date_id ) ).reduce( ( acc, ids )=> {
				acc.push( ... ids )
				return acc
			}, [] )
		}

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

	export class $bun_tasks_editable_text extends $.$bun_tasks_editable_text {

		@ $mol_mem
		edit_mode( next?: boolean ) {
			return next ?? false
		}

		@ $mol_mem
		sub() {
			return [
				this.edit_mode() ? this.Edit() : this.Non_edit()
			]
		}

	}

}
