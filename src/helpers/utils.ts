export const getNextNum = (num: string, slice_num: number) => {
	const id = num.slice(-slice_num);
	const id_num = parseInt(id) + 1;
	return ('0'.repeat(slice_num+5) + id_num).slice(-slice_num);
};