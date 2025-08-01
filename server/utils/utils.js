import bcrypt from 'bcrypt'
import { DateTime } from 'luxon'

export const hashPassword = async password => {
	const salt = await bcrypt.genSalt(10)
	return await bcrypt.hash(password, salt)
}

export const convertDateToSameFormatWithServer = date => {
	const jsDate = new Date(date)
	const dateTime = DateTime.fromJSDate(jsDate)
	const formattedDate = dateTime.toFormat('yyyy-MM-dd')
	return formattedDate
}
