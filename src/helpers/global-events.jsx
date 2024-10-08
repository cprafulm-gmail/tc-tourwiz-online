import * as Global from "../helpers/global";
import Config from "../config.json";

export const handleCheckforFreeExcess = (props, element, itemCount) => {
  let quotaUsage = localStorage.getItem("quotaUsage");
  let quota = Global.LimitationQuota[element];
  if (quota && quotaUsage && Config.codebaseType === "tourwiz" && props.userInfo.rolePermissions && (props.userInfo.rolePermissions.isFreePlan || props.userInfo.rolePermissions.isPlanExpire)) {
    quotaUsage = JSON.parse(quotaUsage);
    if (quotaUsage) {
      if (quotaUsage[quota] && !quotaUsage["totalUsed" + quota]) {
        // if (quotaUsage["totalUsed" + quota] === null)
        //   quotaUsage["totalUsed" + quota] = 1;
        // else
        //   quotaUsage["totalUsed" + quota] = quotaUsage["totalUsed" + quota] + 1;
        // localStorage.setItem("quotaUsage", JSON.stringify(quotaUsage));
        return true;
      }
      else if (quotaUsage[quota] && quotaUsage["totalUsed" + quota]) {

        let accessquota = Number(quotaUsage[quota]);
        let totalusedquota = Number(quotaUsage["totalUsed" + quota]);

        if (totalusedquota >= accessquota)
          return false;
        else {
          // if (quotaUsage["totalUsed" + quota] === null)
          //   quotaUsage["totalUsed" + quota] = 1;
          // else
          //   quotaUsage["totalUsed" + quota] = quotaUsage["totalUsed" + quota] + 1;
          // localStorage.setItem("quotaUsage", JSON.stringify(quotaUsage));
          return true;
        }
      }
    }
    else
      return false;
  }
  else
    return true;

};