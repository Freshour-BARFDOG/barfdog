import {getDataSSR} from '../../src/pages/api/reqData';
import {inquiryAuthorType} from '../../store/TYPE/inquiry/inquiryAuthorType';

export const getDtataSSR_inquiryAuthorType = async (req, id) => {
  let AUTHOR_TYPE = null;
  const apiUrl = `/api/questions/type${id}`;
  const res = await getDataSSR( req, apiUrl );
  if ( res.data && res.status === 200 ) {
    AUTHOR_TYPE = inquiryAuthorType[res.data.type.uppercase()];
  }
  return AUTHOR_TYPE;
};