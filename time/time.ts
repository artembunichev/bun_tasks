namespace $ {

	export function $bun_tasks_time_shift_days( start: string, day_count: number ) {
		var start_date = new Date( start )

		var result_day = start_date.setDate( start_date.getDate() + day_count )

		return new $mol_time_moment( result_day ).toString( 'YYYY-MM-DD' )
	}

	export function $bun_tasks_time_is_today( date: string ) {
		var today = new Date().setHours( 0, 0, 0, 0 )

		var target = new Date( date ).setHours( 0, 0, 0, 0 )

		return target === today
	}

	export function $bun_tasks_time_is_prev( date: string ) {
		var today = new Date().setHours( 0, 0, 0, 0 )

		var target = new Date( date ).setHours( 0, 0, 0, 0 )

		return today > target
	}

	export function $bun_tasks_time_is_next( date: string ) {
		var today = new Date().setHours( 0, 0, 0, 0 )

		var target = new Date( date ).setHours( 0, 0, 0, 0 )

		return target > today
	}

}
