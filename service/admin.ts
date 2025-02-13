import {getData, getDataSSR} from "@src/pages/api/reqData";

export { getAllianceList };

const getAllianceList = async (req) => {
	const { data } = await getDataSSR(req, '/api/alliance');
	// select - options 로 관리하기 위한 데이터 가공
	return data._embedded.allianceResponseDtoList.map(item => ({
		label: item.allianceName,
		value: item.allianceId,
		inStock: true,
	})) || [];
}