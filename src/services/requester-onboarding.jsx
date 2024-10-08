import { apiRequester_unified_api } from "./requester-unified-api";

export function apiRequesterV3(reqURL, reqOBJ, callback, reqMethod) {
  return apiRequester_unified_api(reqURL, reqOBJ, callback, reqMethod);
}
