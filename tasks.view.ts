namespace $.$$ {

	export class $bun_tasks_bar extends $.$bun_tasks_bar {

		@ $mol_mem
		ids( next?: Array< number > ){
			return next ?? []
		}

		new_id() {
			return Math.max( 0, ...this.ids() ) + 1
		}


		@ $mol_mem_key
		task( id: number, next?: $bun_tasks_task_model ) {
			return next ?? null
		}

		@ $mol_mem_key
		task_title( id: number, next?: string ) {
			return this.task( id )?.title( next ) ?? ''
		}

		@ $mol_mem_key
		task_details( id: number, next?: string ) {
			return this.task( id )?.details( next ) ?? ''
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

		@ $mol_mem_key
		task_done( id: number, next?: boolean ) {
			return this.task( id )?.done( next ) ?? false
		}

		sort_tasks() {
			this.ids(
				this.ids().slice().sort( ( a, b )=> {
					return Number( this.task_done( a ) ) - Number( this.task_done( b ) )
				} )
			)
		}

		toggle_task_done( id: number ) {
			this.task_done( id, !this.task_done( id ) )
			this.sort_tasks()
		}

		@ $mol_mem
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

}
