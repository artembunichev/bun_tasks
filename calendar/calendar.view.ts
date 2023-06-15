namespace $.$$ {

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

		@ $mol_mem
		sub() {
			return [
				this.Task_calendar()
			]
		}

	}

}
